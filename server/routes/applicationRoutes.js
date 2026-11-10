const express = require('express');
const router = express.Router();
const {
    createApplication,
    getMyApplications,
    getApplications,
    getApplicationById,
    updateApplicationStatus,
    updatePaymentStatus,
    getAdmissionCount,
} = require('../controllers/applicationController');
const { protect, staffOrAdmin, studentOnly } = require('../middleware/authMiddleware');

// Public route for the live counter
router.get('/stats/count', getAdmissionCount);

router
    .route('/')
    .post(protect, studentOnly, createApplication)
    .get(protect, staffOrAdmin, getApplications);

router.get('/my', protect, studentOnly, getMyApplications);
router.get('/:id', protect, getApplicationById);
router.put('/:id/status', protect, staffOrAdmin, updateApplicationStatus);
router.put('/:id/pay', protect, studentOnly, updatePaymentStatus);

module.exports = router;
