import { Request, Response, NextFunction } from "express";

// const { returnCsrfToken } = require('../controllers/auth.controller');
import { returnCsrfToken } from '../controllers/auth.controller';

// Middleware for csrf token validation
export default function authenticateCsrf(req: Request, res: Response, next: NextFunction) {
    const token = req.body.csrf;

    if (!token) {
        return res.status(401).json({ message: "No csrf in body" });
    };

    // Validate CSRF token against app instance
    if (token !== returnCsrfToken()) {
        return res.status(401).json({ message: "Failed csrf verification between refresh token and instance from auth controller" });
    };

    next();
};