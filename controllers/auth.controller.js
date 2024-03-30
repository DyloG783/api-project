const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
const crypto = require('crypto');
const { comparePassword } = require('../util/comparePassword.js');

let csrfToken = null;

// Login endpoint to generate JWT token
const login = async (req, res) => {
    let user;

    // Authenticate user
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ "message": "Missing email or password from login request" });
    }

    try {
        user = await User.findOne({ username: username });
        if (user === undefined) return res.status(404).json({ "message": "No user with this username found in db" });
    } catch (error) {
        return res.status(500).json({ "message": "DB failure finding user by username" });
    }

    const hashedPassword = user.password;

    if (! await comparePassword(password, hashedPassword)) {
        return res.status(401).json({ 'message': 'Incorrect password' });
    }


    csrfToken = crypto.randomUUID();

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
    const refresh_token = jwt.sign({
        "RefreshInfo": {
            username: user.username
        }
    },
        process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1d'
    });

    // save refresh token with user in database
    try {
        await User.findByIdAndUpdate(user._id, { refresh_token: refresh_token });
    } catch (error) {
        console.log("Error in Auth controller attempting to update user with refresh token");
    }


    // save jwt as cookie
    res.cookie('REFRESH_TOKEN', refresh_token, { httpOnly: true, sameSite: 'strict', secure: true, maxAge: 24 * 60 * 60 * 1000 }); // 1 day
    res.status(200).json({ access_token, csrfToken });
};

// refreshToken returning access token as json
const refreshToken = async (req, res) => {

    const token = req.cookies.REFRESH_TOKEN;

    if (!token) {
        return res.status(401).send("No cookie called 'REFRESH_TOKEN' found"); // Unauthorized
    }

    // find user by refresh token
    try {
        const user = await User.findOne({ refresh_token: token });

        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err || decoded.RefreshInfo.username !== user.username) {
                return res.status(403).send("Failed jwt verification");
            }
        });

        const accessToken = jwt.sign({ "UserInfo": { username: user.username, roles: user.roles } }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
        res.status(200).json({ accessToken });
    } catch (error) {
        return res.status(500).json({ "message": "DB failure finding user by refresh token" });
    }
};

// sets users refresh token to null in db, and deletes cookie from browser
const logout = async (req, res) => {
    const token = req.cookies.REFRESH_TOKEN;

    if (!token) {
        return res.sendStatus(204); // Not signed in
    }

    // delete user's refresh token in db
    try {
        const user = await User.findOne({ refresh_token: token });
        await User.findByIdAndUpdate(user._id, { refresh_token: null })

    } catch (error) {
        return res.status(500).json({ "message": "DB failure deleting refresh token for user" });
    }

    // delete user's refresh token cookie
    try {
        res.clearCookie('REFRESH_TOKEN')
    } catch (error) {
        return res.status(500).json({ "message": "failure clearing cookie REFRESH_TOKEN" });
    }

    res.sendStatus(200);
};

// because token is stored here in app it needs to be passed dynamically for csrf middleware
const returnCsrfToken = () => {
    return csrfToken;
};

module.exports = {
    login, refreshToken, logout, returnCsrfToken
};