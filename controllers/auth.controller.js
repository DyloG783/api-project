const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');

// Login endpoint to generate JWT token
const login = async (req, res) => {
    // Authenticate user
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("Missing email or password from login request");
    }

    const user = await User.findOne({ username: username });
    const hashedPassword = user.password;

    if (! await comparePassword(password, hashedPassword)) {
        return res.sendStatus(401); // Unauthorized
    }

    // Generate JWT token
    const token = jwt.sign({ username: user.username }, process.env.SECRET_KEY);

    // save jwt as cookie
    res.cookie('SESSIONTOKEN', token, { httpOnly: true });
    res.json({ token });
    // res.end();
};

// Middleware for authentication
function authenticateToken(req, res, next) {
    const token = req.cookies.SESSIONTOKEN;

    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user;
        next();
    });
}

// Function to hash a password with a generated salt
async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(2);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error hashing password');
    }
}

// Function to compare a plain text password with a hashed password
async function comparePassword(plainPassword, hashedPassword) {
    try {
        const match = await bcrypt.compare(plainPassword, hashedPassword);
        return match;
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
}

module.exports = {
    login, authenticateToken, hashPassword, comparePassword
}