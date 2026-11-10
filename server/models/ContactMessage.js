const mongoose = require('mongoose');

const contactMessageSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['New', 'Replied'],
        default: 'New',
    },
}, {
    timestamps: true,
});

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

module.exports = ContactMessage;
