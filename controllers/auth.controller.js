const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
const crypto = require('crypto');
const { comparePassword } = require('../util/comparePassword.js');

let csrfToken;

// Login endpoint to generate JWT token
const login = async (req, res) => {

    // Authenticate user
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ "message": "Missing email or password from login request" });
    }

    const user = await User.findOne({ username: username });
    const hashedPassword = user.password;

    if (! await comparePassword(password, hashedPassword)) {
        return res.status(401).json({ 'message': 'Incorrect password.' });
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
    await User.findByIdAndUpdate(user._id, { refresh_token: refresh_token })

    // save jwt as cookie
    res.cookie('REFRESH_TOKEN', refresh_token, { httpOnly: true, sameSite: 'strict', secure: true, maxAge: 24 * 60 * 60 * 1000 }); // 1 day
    res.json({ access_token, csrfToken });
    // res.json({ access_token});
};

// refreshToken returning access token as json
const refreshToken = async (req, res) => {

    const token = req.cookies.REFRESH_TOKEN;

    if (!token) {
        return res.status(401).send("No cookie called 'REFRESH_TOKEN' found."); // Unauthorized
    }

    // find user by refresh token
    try {
        const user = await User.findOne({ refresh_token: token });

        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err || decoded.RefreshInfo.username !== user.username) {
                return res.status(403).send("Failed jwt verification."); // Forbidden
            }
            const accessToken = jwt.sign({ "UserInfo": { username: user.username, roles: user.roles } }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
            res.json({ accessToken });
        });
    } catch (error) {
        console.log("Failed finding user by refresh token.");
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
        // console.log(user)
        await User.findByIdAndUpdate(user._id, { refresh_token: null })

    } catch (error) {
        console.log("Failed clearing refresh token in db. ", error);
    }

    // delete user's refresh token cookie
    try {
        res.clearCookie('REFRESH_TOKEN')
    } catch (error) {
        console.log("Failed clearing refresh token cookie. ", error);
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