import { Request, Response, NextFunction } from "express";
import { returnCsrfToken } from '../controllers/auth.controller';

/**
 * Validates the csrf token passed in from the request matches the app instance
 */

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