const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const staffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Staff name is required'],
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
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
        type: String,
        enum: {
            values: ['admin', 'staff'],
            message: '{VALUE} is not a valid role',
        },
        default: 'staff',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Match entered password to hashed password
staffSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Hash password before saving (Mongoose 9.x — no next() in async hooks)
staffSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const Staff = mongoose.model('Staff', staffSchema, 'staff');

module.exports = Staff;
