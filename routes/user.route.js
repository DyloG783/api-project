const express = require('express');
const router = express.Router();
const { getUser, getUsers, createUser } = require('../controllers/user.controller.js');

const { authenticateCsrf } = require("../middleware/authenticateCsrf.middleware.js");
const { verifyAdmin } = require("../middleware/verifyAdmin.middleware.js");
const { authenticateAccessToken } = require("../middleware/authenticateAccessToken.middleware.js");

router.get('/:id', authenticateCsrf, authenticateAccessToken, verifyAdmin, getUser);
router.get('/', authenticateCsrf, authenticateAccessToken, verifyAdmin, getUsers);
router.post('/', authenticateCsrf, authenticateAccessToken, verifyAdmin, createUser);

module.exports = router;