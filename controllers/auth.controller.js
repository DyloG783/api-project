const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');

// Secret key for JWT signing
const secretKey = 'your_secret_key';

// Login endpoint to generate JWT token
const login = async (req, res) => {
    // Authenticate user
    const { username, password } = req.body;
    const user = await User.findOne({
        username: username,
        password: password
    });

    if (!user) {
        return res.sendStatus(401); // Unauthorized
    }

    // Generate JWT token
    const token = jwt.sign({ username: user.username }, secretKey);

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

module.exports = {
    login, authenticateToken
}