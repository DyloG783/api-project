import express from 'express';
const router = express.Router();
import { getUser, getUsers, createUser } from '../controllers/user.controller';

import authenticateCsrf from "../middleware/authenticateCsrf.middleware";
import verifyAdmin from "../middleware/verifyAdmin.middleware";
import authenticateAccessToken from "../middleware/authenticateAccessToken.middleware";

router.get('/:id', authenticateCsrf, authenticateAccessToken, verifyAdmin, getUser);
router.get('/', authenticateCsrf, authenticateAccessToken, verifyAdmin, getUsers);
router.post('/', authenticateCsrf, authenticateAccessToken, verifyAdmin, createUser);

export default router;