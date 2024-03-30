const jwt = require('jsonwebtoken');
const { returnCsrfToken } = require('../controllers/auth.controller');

// Middleware for csrf token validation
function authenticateCsrf(req, res, next) {
    const token = req.body.csrf;

    if (!token) {
        // console.log("NO TOKEN found in 'authenticateCsrf'"); // for test debugging
        // console.log("TOKEN 'authenticateCsrf' (req.body.csrf): ", token); // for test debugging
        return res.status(401).send("No csrf in body"); // Unauthorized
    };

    // jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    //     if (err) {
    //         // console.log("ERROR in jwt-verify, in 'authenticateCsrf' ", err); // for test debugging
    //         return res.status(401).send("Failed verifying refresh token jwt in auth controller.");
    //     };
    //     if (decoded.RefreshInfo.csrf !== returnCsrfToken()) {
    //         // console.log("FAILED COMPARING csrf between decoded token and app, in 'authenticateCsrf'"); // for test debugging
    //         console.log("DECODED token ", decoded.RefreshInfo.csrf); // for test debugging
    //         console.log("CSRF in app' ", returnCsrfToken()); // for test debugging
    //         return res.status(401).send("Failed csrf verification between refresh token and instance from auth controller.");
    //     };
    //     next();
    // });

    if (token !== returnCsrfToken()) {
        console.log("body token ", token); // for test debugging
        console.log("CSRF in app' ", returnCsrfToken()); // for test debugging
        return res.status(401).send("Failed csrf verification between refresh token and instance from auth controller.");
    };

    next();
}

module.exports = { authenticateCsrf };