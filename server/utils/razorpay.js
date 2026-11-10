// Minimal Razorpay client (Orders + Payments API) using fetch.
// Keys: RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET (use rzp_test_... keys for test mode).
const crypto = require('crypto');

const API_BASE = (process.env.RAZORPAY_API_BASE || 'https://api.razorpay.com/v1').replace(/\/$/, '');

const isConfigured = () => Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
const isTestMode = () => String(process.env.RAZORPAY_KEY_ID || '').startsWith('rzp_test_');

const request = async (method, path, body) => {
    const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');
    const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const err = new Error(data?.error?.description || `Razorpay request failed (${res.status})`);
        err.statusCode = 502;
        throw err;
    }
    return data;
};

// amount is in paise
const createOrder = ({ amount, receipt, notes }) =>
    request('POST', '/orders', { amount, currency: 'INR', receipt, notes });

const fetchPayment = (paymentId) => request('GET', `/payments/${encodeURIComponent(paymentId)}`);

const capturePayment = (paymentId, amount) =>
    request('POST', `/payments/${encodeURIComponent(paymentId)}/capture`, { amount, currency: 'INR' });

// Checkout signature = HMAC_SHA256(order_id + "|" + payment_id, key_secret)
const isValidSignature = (orderId, paymentId, signature) => {
    if (!orderId || !paymentId || !signature) return false;
    const expected = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');
    const a = Buffer.from(expected);
    const b = Buffer.from(String(signature));
    return a.length === b.length && crypto.timingSafeEqual(a, b);
};

module.exports = { isConfigured, isTestMode, createOrder, fetchPayment, capturePayment, isValidSignature };
