import { Request, Response, NextFunction } from "express";

const jwt = require('jsonwebtoken');

// admin role check
export default function verifyAdmin(req: Request, res: Response, next: NextFunction) {

    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No Bearer auth header found in "verifyAdmin"' });
    };

    // Validate user access token
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err: any, decoded: { UserInfo: { roles: []; }; }) => {
            if (err) return res.status(403).json({ message: "Invalid access token" });

            // Validate user role
            const roles = decoded.UserInfo.roles;
            if (!roles.find(role => role === 2)) return res.status(403).send("No ADMIN role found on user");

            next();
        }
    );
};