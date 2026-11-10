const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const Staff = require('../models/Staff');
const Course = require('../models/Course');
const Admission = require('../models/Admission');
const Enquiry = require('../models/Enquiry');
const ContactMessage = require('../models/ContactMessage');

// @desc    Get all users (with optional role filter)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const role = req.query.role;

    if (role === 'student') {
        const students = await Student.find({}).select('-password');
        const result = students.map(s => ({ ...s.toObject(), role: 'student' }));
        res.json(result);
    } else if (role === 'staff') {
        const staff = await Staff.find({ role: 'staff' }).select('-password');
        res.json(staff);
    } else if (role === 'admin') {
        const admins = await Staff.find({ role: 'admin' }).select('-password');
        res.json(admins);
    } else {
        // Return all users combined
        const students = await Student.find({}).select('-password');
        const staff = await Staff.find({}).select('-password');
        const allUsers = [
            ...students.map(s => ({ ...s.toObject(), role: 'student' })),
            ...staff.map(s => s.toObject()),
        ];
        res.json(allUsers);
    }
});

// @desc    Get all students (dedicated endpoint)
// @route   GET /api/users/students
// @access  Private/Admin
const getAllStudents = asyncHandler(async (req, res) => {
    const students = await Student.find({}).select('-password').sort({ createdAt: -1 });
    res.json(students);
});

// @desc    Get all admission applied students
// @route   GET /api/users/admissions
// @access  Private/Admin
const getAllAdmissions = asyncHandler(async (req, res) => {
    const admissions = await Admission.find({})
        .populate('studentId', 'name email course semester')
        .sort({ createdAt: -1 });
    res.json(admissions);
});

// @desc    Create an admin
// @route   POST /api/users/admin
// @access  Private/Admin
const createAdmin = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const exists = await Staff.findOne({ email });
    if (exists) {
        res.status(400);
        throw new Error('Email already in use');
    }

    const admin = await Staff.create({
        name,
        email,
        password,
        role: 'admin',
    });

    if (admin) {
        res.status(201).json(admin);
    } else {
        res.status(400);
        throw new Error('Invalid admin data');
    }
});

// @desc    Update an admin
// @route   PUT /api/users/admin/:id
// @access  Private/Admin
const updateAdmin = asyncHandler(async (req, res) => {
    const admin = await Staff.findById(req.params.id);

    if (admin && admin.role === 'admin') {
        admin.name = req.body.name || admin.name;
        admin.email = req.body.email || admin.email;
        if (req.body.password) {
            admin.password = req.body.password;
        }
        const updatedAdmin = await admin.save();
        res.json(updatedAdmin);
    } else {
        res.status(404);
        throw new Error('Admin not found');
    }
});

// @desc    Delete user (staff or student)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    // Try Staff collection
    let user = await Staff.findById(req.params.id);
    if (user) {
        if (user.role === 'admin') {
            res.status(403);
            throw new Error('Cannot delete an admin user');
        }
        await user.deleteOne();
        return res.json({ message: 'Staff member removed' });
    }

    // Try Student collection
    user = await Student.findById(req.params.id);
    if (user) {
        await user.deleteOne();
        await Admission.deleteMany({ studentId: user._id });
        return res.json({ message: 'Student removed' });
    }

    res.status(404);
    throw new Error('User not found');
});

// @desc    Create a staff member
// @route   POST /api/users/staff
// @access  Private/Admin
const createStaff = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const exists = await Staff.findOne({ email });
    if (exists) {
        res.status(400);
        throw new Error('Email already in use');
    }

    const staff = await Staff.create({
        name,
        email,
        password,
        role: 'staff',
    });

    if (staff) {
        res.status(201).json(staff);
    } else {
        res.status(400);
        throw new Error('Invalid staff data');
    }
});

// @desc    Update a staff member
// @route   PUT /api/users/staff/:id
// @access  Private/Admin
const updateStaff = asyncHandler(async (req, res) => {
    const staff = await Staff.findById(req.params.id);

    if (staff && staff.role === 'staff') {
        staff.name = req.body.name || staff.name;
        staff.email = req.body.email || staff.email;
        if (req.body.password) {
            staff.password = req.body.password;
        }
        const updatedStaff = await staff.save();
        res.json(updatedStaff);
    } else {
        res.status(404);
        throw new Error('Staff member not found');
    }
});

// @desc    Create a student
// @route   POST /api/users/student
// @access  Private/Admin
const createStudent = asyncHandler(async (req, res) => {
    const { name, email, contactNumber, password } = req.body;

    const exists = await Student.findOne({ email });
    if (exists) {
        res.status(400);
        throw new Error('Email already in use');
    }

    const student = await Student.create({
        name,
        email,
        contactNumber,
        password,
    });

    if (student) {
        res.status(201).json(student);
    } else {
        res.status(400);
        throw new Error('Invalid student data');
    }
});

// @desc    Update a student
// @route   PUT /api/users/student/:id
// @access  Private/Admin
const updateStudent = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (student) {
        student.name = req.body.name || student.name;
        student.email = req.body.email || student.email;
        student.contactNumber = req.body.contactNumber || student.contactNumber;
        if (req.body.password) {
            student.password = req.body.password;
        }
        const updatedStudent = await student.save();
        res.json(updatedStudent);
    } else {
        res.status(404);
        throw new Error('Student not found');
    }
});

// @desc    Dashboard Statistics
// @route   GET /api/users/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    const adminCount = await Staff.countDocuments({ role: 'admin' });
    const staffCount = await Staff.countDocuments({ role: 'staff' });
    const studentCount = await Student.countDocuments({});
    const courseCount = await Course.countDocuments({});
    const applicationCount = await Admission.countDocuments({});
    const enquiryCount = await Enquiry.countDocuments({});
    const contactCount = await ContactMessage.countDocuments({});

    const paidAdmissions = await Admission.find({ paymentStatus: 'Paid' });
    const totalRevenue = paidAdmissions.reduce((sum, a) => sum + (a.totalFees || 0), 0);

    res.json({
        admins: adminCount,
        staff: staffCount,
        students: studentCount,
        courses: courseCount,
        applications: applicationCount,
        enquiries: enquiryCount,
        contacts: contactCount,
        payments: paidAdmissions.length,
        revenue: totalRevenue,
    });
});

module.exports = {
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
};
