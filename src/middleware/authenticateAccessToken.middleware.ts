import { Request, Response, NextFunction } from "express";

const jwt = require('jsonwebtoken');

/**
 * Validates the access token stored in the response headers Authorization Bearer token
 */

// Middleware for authorisation
export default function authenticateAccessToken(req: Request, res: Response, next: NextFunction) {

    const authHeader = req.headers.authorization || req.headers.Authorization;

    // Validate Bearer token exists in request header
    if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "No Bearer auth header found in authenticateAccessToken" });
    };

    // Validate Bearer token
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err: any) => {
            if (err) return res.status(403).send("Invalid access token");
            next();
        }
    );
};