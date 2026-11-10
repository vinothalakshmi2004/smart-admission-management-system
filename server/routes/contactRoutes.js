const express = require('express');
const router = express.Router();
const {
    submitContactForm,
    getContactMessages,
    updateMessageStatus,
} = require('../controllers/contactController');
const { protect, staffOrAdmin } = require('../middleware/authMiddleware');
const { formLimiter } = require('../middleware/rateLimiters');

router.route('/')
    .post(formLimiter, submitContactForm)
    .get(protect, staffOrAdmin, getContactMessages);

router.route('/:id').put(protect, staffOrAdmin, updateMessageStatus);

module.exports = router;
