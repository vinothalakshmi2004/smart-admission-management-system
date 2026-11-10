const express = require('express');
const router = express.Router();
const {
    submitEnquiry,
    getEnquiries,
    updateEnquiryStatus,
    deleteEnquiry,
} = require('../controllers/enquiryController');
const { protect, admin, staffOrAdmin } = require('../middleware/authMiddleware');
const { formLimiter } = require('../middleware/rateLimiters');

router.post('/', formLimiter, submitEnquiry);
router.get('/', protect, staffOrAdmin, getEnquiries);
router.put('/:id', protect, staffOrAdmin, updateEnquiryStatus);
router.delete('/:id', protect, admin, deleteEnquiry);

module.exports = router;
