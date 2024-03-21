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
        return res.sendStatus(401).json({ 'message': 'Incorrect password.' }); // Unauthorized
    }

    // Generate JWT access token
    const access_token = jwt.sign({
        "UserInfo": {
            username: user.username,
            roles: user.roles
        }
    },
        process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '30s'
    });

    // Generate JWT refresh token
    const refresh_token = jwt.sign({ username: user.username }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1d'
    });

    // save refresh token with user in database
    await User.findByIdAndUpdate(user._id, { refresh_token: refresh_token })

    // save jwt as cookie
    res.cookie('SESSIONTOKEN', refresh_token, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 }); // 1 day
    res.json({ access_token });
};

// Middleware for authentication
function authenticateToken(req, res, next) {

    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401).json({ 'message': 'No Bearer auth header found in "authenticateToken".' });
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).send("Invalid access token"); //invalid token
            req.user = decoded.UserInfo.username;
            next();
        }
    );
}

// admin role check
function verifyAdmin(req, res, next) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401).json({ 'message': 'No Bearer auth header found in "authenticateToken".' });
    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).send("Invalid access token"); //invalid token
            // req.user = decoded.UserInfo.username;
            const roles = decoded.UserInfo.roles
            // console.log("ROLES: ", roles);
            // console.log("ROLES type: ", typeof roles);
            if (!roles.find(role => role === 2)) return res.status(403).send("No ADMIN role found on user")
            req.roles = decoded.UserInfo.roles;
            req.roles = decoded.UserInfo.username;
            next();
        }
    );
}

// Function to hash a password with a generated salt
async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(10);
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

// refreshToken returning access token as json
const refreshToken = async (req, res) => {

    const token = req.cookies.SESSIONTOKEN;

    if (!token) {
        return res.status(401).send("No cookie called 'SESSIONTOKEN' found."); // Unauthorized
    }

    // find user by refresh token
    try {
        const user = await User.findOne({ refresh_token: token });

        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err || decoded.username !== user.username) {
                return res.status(403).send("Failed jwt verification."); // Forbidden
            }
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        username: user.username,
                        roles: user.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
            res.json({ accessToken })
        });
    } catch (error) {
        console.log("Failed finding user by refresh token.");
    }
}

const logout = async (req, res) => {
    const token = req.cookies.SESSIONTOKEN;

    if (!token) {
        return res.sendStatus(204); // Not signed in
    }

    // delete user's refresh token in db
    try {
        const user = await User.findOne({ refresh_token: token });
        console.log(user)
        await User.findByIdAndUpdate(user._id, { refresh_token: null })

    } catch (error) {
        console.log("Failed clearing refresh token in db. ", error);
    }

    // delete user's refresh token cookie
    try {
        res.clearCookie('SESSIONTOKEN') // may need to remove secure?
    } catch (error) {
        console.log("Failed clearing refresh token cookie. ", error);
    }

    res.send(200);
}

module.exports = {
    login, authenticateToken, hashPassword, comparePassword, refreshToken, logout, verifyAdmin
}