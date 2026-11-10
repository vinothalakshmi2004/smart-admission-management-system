const Staff = require('../models/Staff');

const createDefaultUsers = async () => {
    try {
        // --- Default Admin ---
        const adminEmail = 'rvs@admin.com';
        const existingAdmin = await Staff.findOne({ email: adminEmail });

        if (!existingAdmin) {
            const admin = new Staff({
                name: 'RVS Admin',
                email: adminEmail,
                password: 'rvs@123',
                role: 'admin',
            });
            await admin.save();
            console.log('✅ Default Admin Created: rvs@admin.com / rvs@123');
        } else {
            console.log('ℹ️  Default Admin already exists.');
        }
    } catch (error) {
        console.error('❌ Error creating default users:', error.message);
    }
};

module.exports = createDefaultUsers;
