const mongoose = require('mongoose');

const enquirySchema = mongoose.Schema({
    studentName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true },
    fatherName: { type: String, required: true },
    dob: { type: Date, required: true },
    schoolName: { type: String, required: true },
    twelfth_group: { type: String, required: true },
    course1: { type: String, required: true },
    course2: { type: String, required: true },
    course3: { type: String, required: true },
    status: {
        type: String,
        enum: ['Assigned', 'Contacted', 'Not Contacted'],
        default: 'Not Contacted'
    },
}, {
    timestamps: true,
});

const Enquiry = mongoose.model('Enquiry', enquirySchema);

module.exports = Enquiry;
