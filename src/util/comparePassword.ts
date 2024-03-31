import bcrypt from 'bcrypt';

// Function to compare a plain text password with a hashed password and return boolean response
export default async function comparePassword(plainPassword: string, hashedPassword: string) {
    try {
        const match = await bcrypt.compare(plainPassword, hashedPassword);
        return match;
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};

// module.exports = {
//     comparePassword
// };