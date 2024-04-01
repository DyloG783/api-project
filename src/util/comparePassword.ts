import bcrypt from 'bcrypt';

export default async function comparePassword(plainPassword: string, hashedPassword: string) {
    try {

        // Validate users input password against hash stored in db
        const match = await bcrypt.compare(plainPassword, hashedPassword);
        return match;

    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};