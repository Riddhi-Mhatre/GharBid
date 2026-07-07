import Razorpay from 'razorpay';
import crypto from 'crypto';
import { env } from '../config/env.js';

// ─── Razorpay instance ────────────────────────────────────────────────────────
const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

/**
 * Creates a Razorpay order for the platform deal fee.
 * @param {Object} opts
 * @param {number}  opts.amountPaise  Amount in paise (e.g. 117882 for ₹1,178.82)
 * @param {string}  opts.receipt      Unique receipt id (e.g. roomId + role)
 * @param {Object}  [opts.notes]      Extra metadata stored on the Razorpay order
 * @returns {Promise<Object>} Razorpay order object
 */
export const createOrder = async ({ amountPaise, receipt, notes = {} }) => {
  const order = await razorpay.orders.create({
    amount: amountPaise,           // in paise
    currency: 'INR',
    receipt,
    notes,
  });
  return order;
};

/**
 * Verifies the Razorpay payment signature.
 * Must be called after the frontend returns razorpay_order_id,
 * razorpay_payment_id, and razorpay_signature.
 *
 * @param {string} orderId     razorpay_order_id from client
 * @param {string} paymentId   razorpay_payment_id from client
 * @param {string} signature   razorpay_signature from client
 * @returns {boolean} true if signature is valid
 */
export const verifySignature = (orderId, paymentId, signature) => {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');
  return expectedSignature === signature;
};

/**
 * Fetches a Razorpay payment object by paymentId.
 * Useful for server-side amount/currency confirmation.
 */
export const fetchPayment = (paymentId) => razorpay.payments.fetch(paymentId);
