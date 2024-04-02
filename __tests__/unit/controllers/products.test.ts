import { jest } from '@jest/globals';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct, } from '../../../src/controllers/product.controller';
// import User from '../../../src/models/product.model';

jest.mock('../../../src/models/product.model', () => ({
    find: jest.fn().mockImplementation(() => {
        return { message: 'Test data' };
    }),

    create: jest.fn().mockImplementation(() => {
        return;
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

describe('POST (Create) /api/products/', () => {

    it('Allows valid input', async () => {

        const req = {
            body: {
                data: {
                    "name": "validinput",
                    "quantity": 10,
                    "price": 99.99
                }
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await createProduct(req as any, res as any);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('Rejects malicious user input - script tag', async () => {

        const req = {
            body: {
                data: {
                    "name": "<script>",
                    "quantity": 10,
                    "price": 99.99
                }
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await createProduct(req as any, res as any);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid product data" });
    });

    it('Rejects malicious user input - special characters', async () => {

        const req = {
            body: {
                data: {
                    "name": "#$%^&",
                    "quantity": 10,
                    "price": 99.99
                }
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await createProduct(req as any, res as any);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid product data" });
    });

    it('Rejects malicious user input - sql terms', async () => {

        const req = {
            body: {
                data: {
                    "name": `"';`,
                    "quantity": 10,
                    "price": 99.99
                }
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await createProduct(req as any, res as any);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid product data" });
    });
});
