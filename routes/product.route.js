const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/product.controller.js');
const { authenticateToken } = require("../controllers/auth.controller.js");

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', authenticateToken, createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;