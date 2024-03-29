const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, } = require('../controllers/product.controller.js');
const { authenticateCsrf } = require("../middleware/authenticateCsrf.middleware.js");
const { verifyAdmin } = require("../middleware/verifyAdmin.middleware.js");
const { authenticateAccessToken } = require("../middleware/authenticateAccessToken.middleware.js");

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', authenticateCsrf, authenticateAccessToken, createProduct);
router.put('/:id', authenticateAccessToken, updateProduct);
router.delete('/:id', authenticateAccessToken, verifyAdmin, deleteProduct);

module.exports = router;