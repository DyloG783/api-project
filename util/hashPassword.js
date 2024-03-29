const bcrypt = require('bcrypt');

// Hash a plain text password with a generated salt and return hashed password
async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error hashing password');
    }
};

module.exports = {
    hashPassword
};