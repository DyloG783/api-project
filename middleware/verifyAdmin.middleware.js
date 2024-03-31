const jwt = require('jsonwebtoken');

// admin role check
function verifyAdmin(req, res, next) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: 'No Bearer auth header found in "verifyAdmin"' });

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: "Invalid access token" });

            const roles = decoded.UserInfo.roles;
            if (!roles.find(role => role === 2)) return res.status(403).send("No ADMIN role found on user");

            next();
        }
    );
};

module.exports = { verifyAdmin };