import { jest } from '@jest/globals';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct, } from '../../../src/controllers/product.controller';
// import User from '../../../src/models/product.model';

jest.mock('../../../src/models/product.model', () => ({
    find: jest.fn().mockImplementation(() => {
        return { message: 'Test data' };
    }),
}));

// Cast to any to suppress TypeScript error
// const MockedProduct = Product as any;

beforeEach(() => {
    jest.clearAllMocks();
});
// afterEach(() => {
//     User.mockClear();
// });

describe('GET /api/products/', () => {

    it('"getProducts" function happy path getProducts returns 200', async () => {

        // Product.find.mockReturnValueOnce({ message: 'Test data' });

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getProducts(req as any, res as any);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Test data' });
    });

    // cant overwrite set mock function val for non default exports
    it.skip('"getProducts" db error getProducts', async () => {

        // Product.find.mockImplementationOnce(() => {
        //     throw new Error('Test error');
        // });
        // jest.mock('../../../models/product.model', () => ({
        //     find: jest.fn().mockImplementation(() => {
        //         throw new Error('Test error');
        //     }),
        // }));

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


