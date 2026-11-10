const express = require('express');
const router = express.Router();
const { registerUser, authUser, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiters');

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, authUser);
router.put('/password', protect, changePassword);

module.exports = router;
