const generateToken = require('./generateToken');

// What the client stores after login / registration (never the password).
const userPayload = (user, role) => {
    const payload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role,
        contactNumber: user.contactNumber || '',
        token: generateToken(user._id),
    };
    if (role === 'staff' || role === 'admin') {
        payload.department = user.department || '';
        payload.employeeId = user.employeeId || '';
        payload.className = user.className || '';
    }
    return payload;
};

module.exports = userPayload;
