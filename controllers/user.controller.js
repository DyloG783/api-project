const User = require('../models/user.model.js');
const { hashPassword } = require('../controllers/auth.controller.js');

const getUser = async (req, res) => {
    try {

        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const getUsers = async (req, res) => {
    try {

        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const createUser = async (req, res) => {
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
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getUser, getUsers, createUser
}