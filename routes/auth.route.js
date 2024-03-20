const express = require('express');
const router = express.Router();
const { login, refreshToken, logout } = require('../controllers/auth.controller.js');

router.post('/', login);
router.get('/refresh', refreshToken);
router.get('/logout', logout);

module.exports = router;