import { jest } from '@jest/globals';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct, } from '../../../controllers/product.controller';

// jest.mock('../../../models/product.model', () => ({
//     Product: jest.fn(),
// }));
jest.mock('../../../models/product.model', () => ({
    default: jest.fn().mockImplementation(() => ({
        find: jest.fn(), // Mocking find method

    })),
}));
import Product from '../../../models/product.model';


// Cast to any to suppress TypeScript error
// const MockedProduct = Product as any;

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

        await getProducts(req as any, res as any);

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

        await getProducts(req as any, res as any);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Test error' });
    });
});


