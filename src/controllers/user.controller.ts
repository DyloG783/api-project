import { zIdParamSchema, zLoginSchema } from '../zod/schema';
import User from '../models/user.model';
import hashPassword from '../util/hashPassword';
import { Request, Response } from "express";

/**
 * User controller handles standard CRUD operations against the db
 */

export const getUser = async (req: Request, res: Response) => {
    try {

        // Validate request params
        const input = zIdParamSchema.safeParse(req.params);
        if (!input.success) return res.status(400).json({ "message": "Invalid product id" });

        // Return user from db
        const user = await User.findById(req.params);
        res.status(200).json(user);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {

        // Return all users from db
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {

        // Authenticate user input
        const input = zLoginSchema.safeParse(req.body);
        if (!input.success) return res.status(400).json({ "message": "Missing email or password from login request" });
        const { username, password } = input.data;

        const hashedPassword = await hashPassword(password);

        // Create user in db
        const user = await User.create({
            username: username,
            password: hashedPassword
        });

        res.status(200).json(user);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
};