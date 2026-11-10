const asyncHandler = require('express-async-handler');
const ContactMessage = require('../models/ContactMessage');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContactForm = asyncHandler(async (req, res) => {
    const [name, email, mobile, subject, message] = ['name', 'email', 'mobile', 'subject', 'message']
        .map((f) => String(req.body[f] || '').trim());

    if (!name || !email || !mobile || !subject || !message) {
        res.status(400);
        throw new Error('Please fill in name, email, mobile, subject and message');
    }
    if (!/^\d{10}$/.test(mobile)) {
        res.status(400);
        throw new Error('Mobile number must be 10 digits');
    }

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
        if (req.body.status !== undefined) {
            if (!['New', 'Replied'].includes(req.body.status)) {
                res.status(400);
                throw new Error('Status must be New or Replied');
            }
            message.status = req.body.status;
        }
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
