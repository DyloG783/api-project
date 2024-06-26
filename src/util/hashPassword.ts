import bcrypt from 'bcrypt';

/**
 * Utiltiy function to hash and salt passwords provided by users upon registration
 */

// Hash a plain text password with a generated salt and return hashed password
export default async function hashPassword(password: string) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error hashing password');
    }
};