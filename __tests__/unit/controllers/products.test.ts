import { jest } from '@jest/globals';
import { getProducts } from '../../../src/controllers/product.controller';
const Product = require('../../../src/models/product.model');

jest.mock('../../../src/models/product.model', () => ({
    find: jest.fn().mockImplementation(() => {
        return { message: 'Test data' };
    }),

    create: jest.fn().mockImplementation(() => {
        return;
    }),
}));

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Unit - GET /api/products/', () => {

    it('"getProducts" function happy path getProducts returns 200', async () => {

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
