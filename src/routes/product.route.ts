import express from 'express';
const router = express.Router();
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller';

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
// export default (router: express.Router) => {
//     return router
// }