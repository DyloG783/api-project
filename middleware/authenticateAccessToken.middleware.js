const jwt = require('jsonwebtoken');

// Middleware for authorisation
function authenticateAccessToken(req, res, next) {

    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ 'message': 'No Bearer auth header found in "authenticateAccessToken".' });
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err) => {
            if (err) return res.status(403).json({ "message": "Invalid access token." });
            next();
        }
    );
};

module.exports = { authenticateAccessToken };