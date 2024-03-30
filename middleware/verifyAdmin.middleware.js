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
            if (err) return res.status(403).json({ message: "Invalid access token" }); //invalid token
            // req.user = decoded.UserInfo.username;
            const roles = decoded.UserInfo.roles;
            // console.log("ROLES: ", roles);
            // console.log("ROLES type: ", typeof roles);
            if (!roles.find(role => role === 2)) return res.status(403).send("No ADMIN role found on user");
            req.roles = decoded.UserInfo.roles;
            req.roles = decoded.UserInfo.username;
            next();
        }
    );
};

module.exports = { verifyAdmin };