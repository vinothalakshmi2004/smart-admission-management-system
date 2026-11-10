const fs = require('fs');
const path = require('path');
const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const userPayload = require('../utils/userPayload');
const { UPLOAD_DIR } = require('../middleware/uploadMiddleware');
const { prepareApplication, createAdmissionRecord } = require('./applicationController');

const DOC_FIELDS = ['communityCertificate', 'marksheet'];

const uploadedFile = (req, field) => (req.files && req.files[field] ? req.files[field][0] : null);

// Stored value -> file inside UPLOAD_DIR (older records saved "uploads\\name.pdf")
const storedFilePath = (stored) => path.join(UPLOAD_DIR, path.basename(String(stored).replace(/\\/g, '/')));

const removeFile = (fileName) => {
    if (!fileName) return;
    fs.promises.unlink(storedFilePath(fileName)).catch(() => {});
};

// @desc    Submit the admission application with documents.
//          Saves the details and documents on the student profile and
//          creates the Admission record that the office reviews.
// @route   POST /api/students/apply  (multipart/form-data)
// @access  Private/Student
const applyStudent = asyncHandler(async (req, res) => {
    const newFiles = DOC_FIELDS.map((f) => uploadedFile(req, f)).filter(Boolean);
    const discardNewFiles = () => newFiles.forEach((f) => removeFile(f.filename));

    const student = await Student.findById(req.user._id);
    if (!student) {
        discardNewFiles();
        return res.status(404).json({ message: 'Student not found' });
    }

    let prepared;
    try {
        prepared = await prepareApplication(student, req.body);
        const missingDocs = DOC_FIELDS.filter((f) => !uploadedFile(req, f) && !student[f]);
        if (missingDocs.length) {
            const err = new Error('Please upload your community certificate and 12th marksheet');
            err.statusCode = 400;
            throw err;
        }
    } catch (error) {
        discardNewFiles();
        throw error;
    }

    // Update the student profile with known fields only
    const { data } = prepared;
    Object.assign(student, {
        course: data.course,
        department: data.department,
        contactNumber: data.contactNumber,
        fatherName: data.fatherName,
        motherName: data.motherName,
        dob: data.dob,
        twelfthMark: data.twelfthMark,
        twelfthGroup: data.twelfthGroup,
        schoolName: data.schoolName,
        aadharNumber: data.aadharNumber,
        status: 'Pending',
    });
    for (const field of DOC_FIELDS) {
        const file = uploadedFile(req, field);
        if (file) {
            removeFile(student[field]); // replace the old document
            student[field] = file.filename;
        }
    }
    await student.save();

    const application = await createAdmissionRecord(student, prepared, req.io);

    res.status(201).json({
        message: 'Application submitted successfully',
        application,
        contactNumber: student.contactNumber,
    });
});

// @desc    Authenticate student & login
// @route   POST /api/students/login
// @access  Public
const loginStudent = asyncHandler(async (req, res) => {
    const email = String(req.body.email || '').trim().toLowerCase();
    const student = await Student.findOne({ email });

    if (student && (await student.matchPassword(req.body.password || ''))) {
        return res.json(userPayload(student, 'student'));
    }
    return res.status(401).json({ message: 'Invalid email or password' });
});

// @desc    Download a student's uploaded document
// @route   GET /api/students/:id/documents/:type  (type: communityCertificate | marksheet)
// @access  Private (staff, admin, or the student themself)
const getStudentDocument = asyncHandler(async (req, res) => {
    const { id, type } = req.params;
    if (!DOC_FIELDS.includes(type)) return res.status(400).json({ message: 'Unknown document type' });

    const isOffice = req.userType === 'admin' || req.userType === 'staff';
    const isSelf = req.userType === 'student' && req.user._id.toString() === id;
    if (!isOffice && !isSelf) return res.status(403).json({ message: 'Not authorized' });

    const student = await Student.findById(id).select(type);
    if (!student || !student[type]) return res.status(404).json({ message: 'Document not uploaded' });

    const full = storedFilePath(student[type]);
    if (!fs.existsSync(full)) return res.status(404).json({ message: 'Document file not found' });

    res.setHeader('Cache-Control', 'private, no-store');
    return res.sendFile(full);
});

module.exports = { applyStudent, loginStudent, getStudentDocument };
