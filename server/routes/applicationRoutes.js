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
const { protect, admin } = require('../middleware/authMiddleware');

// Public route for counter
router.get('/stats/count', getAdmissionCount);

// POST /api/applications — JSON body
router
    .route('/')
    .post(protect, createApplication)
    .get(protect, admin, getApplications);

router.route('/my').get(protect, getMyApplications);

router
    .route('/:id')
    .get(protect, getApplicationById);

router.route('/:id/status').put(protect, admin, updateApplicationStatus);
router.route('/:id/pay').put(protect, updatePaymentStatus);

module.exports = router;
