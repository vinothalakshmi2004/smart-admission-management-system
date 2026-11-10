const express = require('express');
const router = express.Router();
const { getPaymentConfig, createPaymentOrder, verifyPayment } = require('../controllers/paymentController');
const { protect, studentOnly } = require('../middleware/authMiddleware');

router.get('/config', getPaymentConfig);
router.post('/order', protect, studentOnly, createPaymentOrder);
router.post('/verify', protect, studentOnly, verifyPayment);

module.exports = router;
