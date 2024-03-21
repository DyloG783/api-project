const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, } = require('../controllers/product.controller.js');
const { authenticateToken, verifyAdmin } = require("../controllers/auth.controller.js");

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', authenticateToken, createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', authenticateToken, verifyAdmin, deleteProduct);

module.exports = router;