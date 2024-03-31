import { Request, Response, NextFunction } from "express";

const jwt = require('jsonwebtoken');

// Middleware for authorisation
export default function authenticateAccessToken(req: Request, res: Response, next: NextFunction) {

    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "No Bearer auth header found in authenticateAccessToken" });
    };

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

// module.exports = { authenticateAccessToken };