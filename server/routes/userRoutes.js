const express = require('express');
const router = express.Router();
const {
    getUsers,
    getAllStudents,
    getAllAdmissions,
    createAdmin,
    updateAdmin,
    deleteUser,
    createStaff,
    updateStaff,
    createStudent,
    updateStudent,
    getDashboardStats,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// GET endpoints
router.route('/').get(protect, admin, getUsers);
router.route('/stats').get(protect, admin, getDashboardStats);
router.route('/students').get(protect, admin, getAllStudents);
router.route('/admissions').get(protect, admin, getAllAdmissions);

// Admin CRUD
router.route('/admin').post(protect, admin, createAdmin);
router.route('/admin/:id').put(protect, admin, updateAdmin);

// Staff CRUD
router.route('/staff').post(protect, admin, createStaff);
router.route('/staff/:id').put(protect, admin, updateStaff);

// Student CRUD
router.route('/student').post(protect, admin, createStudent);
router.route('/student/:id').put(protect, admin, updateStudent);

// Delete any user
router.route('/:id').delete(protect, admin, deleteUser);

module.exports = router;
