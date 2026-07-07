import * as razorpayService from '../services/razorpayService.js';
import * as PaymentModel from '../models/dynamodb/PaymentModel.js';
import * as chatService from '../services/chatService.js';
import * as PropertyModel from '../models/dynamodb/PropertyModel.js';
import * as PurchaseModel from '../models/dynamodb/PurchaseModel.js';
import { generateUUID } from '../utils/helpers.js';
import { HTTP } from '../utils/constants.js';
import { createNotification } from '../services/notificationService.js';
import { env } from '../config/env.js';

// ─── Fee constants (paise) ────────────────────────────────────────────────────
const PLATFORM_FEE_PAISE = 99900;   // ₹999
const GST_RATE            = 0.18;
const TOTAL_PAISE = Math.round(PLATFORM_FEE_PAISE * (1 + GST_RATE)); // ₹1,178.82 → 117882 paise

/**
 * POST /v1/payments/create-order
 * body: { roomId, role: 'buyer'|'seller' }
 *
 * Creates a Razorpay order and returns { orderId, amount, currency, keyId }
 * so the frontend can open the Razorpay checkout widget.
 */
export const createOrder = async (req, res, next) => {
  try {
    const { roomId, role } = req.body;
    if (!roomId || !['buyer', 'seller'].includes(role)) {
      return res.status(HTTP.BAD_REQUEST).json({
        success: false,
        error: 'roomId and role (buyer|seller) are required',
      });
    }

    const room = await chatService.getRoom(roomId);
    if (!room) {
      return res.status(HTTP.NOT_FOUND).json({ success: false, error: 'Chat room not found' });
    }

    // Idempotency: don't create a new order if already paid
    const alreadyPaid = role === 'buyer' ? room.buyerPaid : room.sellerPaid;
    if (alreadyPaid) {
      return res.status(HTTP.CONFLICT).json({
        success: false,
        error: `${role} has already paid the platform fee for this room`,
      });
    }

    const receipt = `${roomId.slice(0, 15)}-${role}-${Date.now()}`;
    const order = await razorpayService.createOrder({
      amountPaise: TOTAL_PAISE,
      receipt,
      notes: {
        roomId,
        role,
        propertyId: room.propertyId ?? '',
        propertyTitle: room.propertyTitle ?? '',
        userId: req.user.userId,
      },
    });

    return res.status(HTTP.CREATED).json({
      success: true,
      data: {
        orderId:  order.id,
        amount:   order.amount,
        currency: order.currency,
        keyId:    env.RAZORPAY_KEY_ID,
        receipt:  order.receipt,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /v1/payments/verify
 * body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, roomId, role }
 *
 * 1. Verifies the HMAC signature from Razorpay.
 * 2. Records the payment in DynamoDB (LegalNest-Payments table).
 * 3. Calls the same deal-closing logic as the old /chat/.../pay endpoint.
 * 4. Returns the chat system message so the frontend can append it.
 */
export const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      roomId,
      role,
    } = req.body;

    // ── 1. Validate inputs ──────────────────────────────────────────────────
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !roomId || !role) {
      return res.status(HTTP.BAD_REQUEST).json({
        success: false,
        error: 'razorpay_order_id, razorpay_payment_id, razorpay_signature, roomId, and role are required',
      });
    }

    // ── 2. Verify signature ─────────────────────────────────────────────────
    const isValid = razorpayService.verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    );
    if (!isValid) {
      return res.status(HTTP.BAD_REQUEST).json({
        success: false,
        error: 'Payment signature verification failed',
      });
    }

    // ── 3. Fetch room ───────────────────────────────────────────────────────
    const room = await chatService.getRoom(roomId);
    if (!room) {
      return res.status(HTTP.NOT_FOUND).json({ success: false, error: 'Chat room not found' });
    }

    // ── 4. Persist payment record in LegalNest-Payments ────────────────────
    const paymentId = generateUUID();
    await PaymentModel.createPayment({
      paymentId,
      razorpayOrderId:   razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      roomId,
      role,
      propertyId:    room.propertyId ?? null,
      propertyTitle: room.propertyTitle ?? null,
      sellerId:      room.sellerId,
      buyerId:       room.buyerId,
      userId:        req.user.userId,
      amountPaise:   TOTAL_PAISE,
      currency:      'INR',
      status:        'captured',
      createdAt:     new Date().toISOString(),
    });

    // ── 5. Mark the paying party's fee in the chat room ────────────────────
    const field = role === 'buyer' ? 'buyerPaid' : 'sellerPaid';
    await chatService.updateRoomDealState(roomId, { [field]: true });

    // Re-fetch room after update so we have the latest flags
    const updatedRoom = await chatService.getRoom(roomId);

    // ── 6. Close deal if BOTH parties have paid ────────────────────────────
    let msg;
    if (updatedRoom && updatedRoom.buyerPaid && updatedRoom.sellerPaid) {
      await chatService.updateRoomDealState(roomId, { dealStatus: 'closed', isActive: false });

      if (updatedRoom.propertyId) {
        await PropertyModel.updateProperty(updatedRoom.propertyId, { status: 'sold' });
        await PurchaseModel.createPurchase({
          purchaseId:    generateUUID(),
          propertyId:    updatedRoom.propertyId,
          buyerId:       updatedRoom.buyerId,
          sellerId:      updatedRoom.sellerId,
          propertyTitle: updatedRoom.propertyTitle,
          amountPaise:   TOTAL_PAISE * 2, // both sides combined
          date:          new Date().toISOString(),
        });
      }

      await createNotification(
        updatedRoom.buyerId,
        'deal_finalized',
        'Deal Finalized',
        `Congratulations! The deal for ${updatedRoom.propertyTitle} has been finalized.`,
        { propertyId: updatedRoom.propertyId },
      );
      await createNotification(
        updatedRoom.sellerId,
        'deal_finalized',
        'Deal Finalized',
        `Congratulations! The deal for ${updatedRoom.propertyTitle} has been finalized.`,
        { propertyId: updatedRoom.propertyId },
      );

      msg = await chatService.saveDealSystemMessage(
        roomId,
        'deal_closed',
        {},
        '🎉 Deal successfully closed! Both parties have paid the platform fee.',
      );
    } else {
      const msgType    = role === 'buyer' ? 'payment_buyer' : 'payment_seller';
      const msgContent = role === 'buyer'
        ? 'Buyer has paid the platform fee.'
        : 'Seller has paid the platform fee.';
      msg = await chatService.saveDealSystemMessage(roomId, msgType, { role }, msgContent);
    }

    return res.json({ success: true, data: msg });
  } catch (err) {
    next(err);
  }
};
