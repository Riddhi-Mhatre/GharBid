import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { createOrder, verifyPayment } from '../../controllers/paymentController.js';

const router = Router();

// All payment routes require a logged-in user
router.use(authenticate);

/**
 * POST /v1/payments/create-order
 * Creates a Razorpay order for the platform fee.
 * Body: { roomId, role: 'buyer'|'seller' }
 */
router.post('/create-order', createOrder);

/**
 * POST /v1/payments/verify
 * Verifies Razorpay signature and records the payment.
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, roomId, role }
 */
router.post('/verify', verifyPayment);

export default router;
