import express from 'express';
const router = express.Router();
import { login, refreshToken, logout } from '../controllers/auth.controller';

router.post('/', login);
router.get('/refresh', refreshToken);
router.get('/logout', logout);

export default router;