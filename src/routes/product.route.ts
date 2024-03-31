// const express = require('express');
import express from 'express';
const router = express.Router();
// import router from 'express.Router';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct, } from '../controllers/product.controller';
import authenticateCsrf from "../middleware/authenticateCsrf.middleware";
import verifyAdmin from "../middleware/verifyAdmin.middleware";
import authenticateAccessToken from "../middleware/authenticateAccessToken.middleware";

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', authenticateCsrf, authenticateAccessToken, createProduct);
router.put('/:id', authenticateAccessToken, updateProduct);
router.delete('/:id', authenticateAccessToken, verifyAdmin, deleteProduct);

export default router;