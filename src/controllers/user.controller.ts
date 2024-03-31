import User from '../models/user.model';
// const User = require('../../models/user.model.js');
import hashPassword from '../util/hashPassword';

import { Request, Response } from "express";

export const getUser = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {

        const users = await User.find({});
        res.status(200).json(users);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).send("Missing email or password from create user request");
        }

        const hashedPassword = await hashPassword(password);

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

// module.exports = {
//     getUser, getUsers, createUser
// };