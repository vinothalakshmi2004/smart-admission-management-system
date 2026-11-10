const express = require('express');
const router = express.Router();
const {
    submitEnquiry,
    getEnquiries,
    deleteEnquiry,
} = require('../controllers/enquiryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', submitEnquiry);
router.get('/', protect, admin, getEnquiries);
router.delete('/:id', protect, admin, deleteEnquiry);

module.exports = router;
