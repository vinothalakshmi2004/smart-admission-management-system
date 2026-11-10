const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: [true, 'Student reference is required'],
    },
    studentName: {
        type: String,
        required: [true, 'Student name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
    },
    course: {
        type: String,
        required: [true, 'Course is required'],
        trim: true,
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true,
    },
    contactNumber: {
        type: String,
        required: [true, 'Contact number is required'],
    },
    fatherName: {
        type: String,
        required: [true, 'Father name is required'],
    },
    motherName: {
        type: String,
        required: [true, 'Mother name is required'],
    },
    dob: {
        type: Date,
        required: [true, 'Date of birth is required'],
    },
    twelfthMark: {
        type: Number,
        required: [true, '12th mark is required'],
    },
    twelfthGroup: {
        type: String,
        required: [true, '12th group is required'],
    },
    schoolName: {
        type: String,
        required: [true, 'School name is required'],
    },
    aadharNumber: {
        type: String,
        required: [true, 'Aadhar number is required'],
    },
    admissionFees: {
        type: Number,
        default: 5000,
        min: [0, 'Admission fees cannot be negative'],
    },
    oneTimeFees: {
        type: Number,
        default: 10000,
        min: [0, 'One-time fees cannot be negative'],
    },
    semesterFees: {
        type: Number,
        default: 0,
        min: [0, 'Semester fees cannot be negative'],
    },
    totalFees: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Cancelled', 'Not Eligible'],
        default: 'Pending',
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Partial'],
        default: 'Pending',
    },
    paymentMethod: {
        type: String,
        default: 'None',
    },
    // Online payment (Razorpay)
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    paidAmount: { type: Number },
    paidAt: { type: Date },
    adminComments: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Auto-calculate totalFees before saving
admissionSchema.pre('save', function () {
    this.totalFees = (this.admissionFees || 0) + (this.oneTimeFees || 0) + (this.semesterFees || 0);
});

const Admission = mongoose.model('Admission', admissionSchema, 'admissions');

module.exports = Admission;
