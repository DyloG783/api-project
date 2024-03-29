const bcrypt = require('bcrypt');

// Function to compare a plain text password with a hashed password and return boolean response
async function comparePassword(plainPassword, hashedPassword) {
    try {
        const match = await bcrypt.compare(plainPassword, hashedPassword);
        return match;
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};

module.exports = {
    comparePassword
};