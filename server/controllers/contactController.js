const asyncHandler = require('express-async-handler');
const ContactMessage = require('../models/ContactMessage');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContactForm = asyncHandler(async (req, res) => {
    const { name, email, mobile, subject, message } = req.body;

    const contact = await ContactMessage.create({
        name,
        email,
        mobile,
        subject,
        message,
    });

    if (contact) {
        res.status(201).json({ message: 'Message sent successfully' });
    } else {
        res.status(400);
        throw new Error('Invalid contact data');
    }
});

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
const getContactMessages = asyncHandler(async (req, res) => {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    res.json(messages);
});

// @desc    Update contact message status
// @route   PUT /api/contact/:id
// @access  Private/Admin
const updateMessageStatus = asyncHandler(async (req, res) => {
    const message = await ContactMessage.findById(req.params.id);

    if (message) {
        message.status = req.body.status || message.status;
        const updatedMessage = await message.save();
        res.json(updatedMessage);
    } else {
        res.status(404);
        throw new Error('Message not found');
    }
});

module.exports = {
    submitContactForm,
    getContactMessages,
    updateMessageStatus,
};
