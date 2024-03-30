const Product = require('../../../models/product.model.js');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, } = require('../../../controllers/product.controller.js');

jest.mock('../../../models/product.model.js');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('GET /api/products/', () => {

    it('"getProducts" function happy path getProducts returns 200', async () => {

        Product.find.mockReturnValueOnce({ message: 'Test data' });

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getProducts(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Test data' });
    });

    it('"getProducts" db error getProducts', async () => {

        Product.find.mockImplementationOnce(() => {
            throw new Error('Test error');
        });

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getProducts(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Test error' });
    });
});


