import { Request, Response, NextFunction } from "express";

const { returnCsrfToken } = require('../controllers/auth.controller');
// import { returnCsrfToken } from '../controllers/auth.controller';

// Middleware for csrf token validation
export default function authenticateCsrf(req: Request, res: Response, next: NextFunction) {
    const token = req.body.csrf;

    if (!token) {
        // console.log("NO TOKEN found in 'authenticateCsrf'"); // for test debugging
        // console.log("TOKEN 'authenticateCsrf' (req.body.csrf): ", token); // for test debugging
        return res.status(401).send("No csrf in body"); // Unauthorized
    };

    if (token !== returnCsrfToken()) {
        // console.log("body token ", token); // for test debugging
        // console.log("CSRF in app' ", returnCsrfToken()); // for test debugging
        return res.status(401).send("Failed csrf verification between refresh token and instance from auth controller");
    };

    next();
}

// module.exports = { authenticateCsrf };