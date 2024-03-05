const express = require('express');
const router = express.Router();
const { getUser, getUsers, createUser } = require('../controllers/user.controller.js');

router.get('/:id', getUser);
router.get('/', getUsers);
router.post('/', createUser);

module.exports = router;