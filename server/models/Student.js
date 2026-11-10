const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    contactNumber: {
        type: String,
        required: [true, 'Contact number is required'],
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
    },
    // Application Fields
    course: { type: String, trim: true },
    department: { type: String, trim: true },
    fatherName: { type: String, trim: true },
    motherName: { type: String, trim: true },
    dob: { type: Date },
    twelfthMark: { type: Number },
    twelfthGroup: { type: String },
    schoolName: { type: String },
    aadharNumber: { type: String },
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
    communityCertificate: { type: String },
    marksheet: { type: String }
}, {
    timestamps: true,
});

// Compare entered password with hashed password
studentSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Hash password before saving
studentSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const Student = mongoose.model('Student', studentSchema, 'students');

module.exports = Student;
