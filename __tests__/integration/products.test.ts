import request from 'supertest';
import mongoose from 'mongoose';
import Product from '../../src/models/product.model';
import app from '../../src/app';

describe('Integration - Product public tests', () => {

    let testProductId: string;
    let testProduct = {
        "name": "test_product",
        "quantity": 10,
        "price": 99.99
    };

    beforeAll(async () => {

        // connect to testinstance db for particular testfile
        try {
            await mongoose.connect(`${process.env.MONGOOSE_DEV_CONNECTION}/products`);
        } catch (error) {
            console.log("Failed connecting to MONGOOSE_DEV_CONNECTION products: ", error);
            return;
        }

        // create test product in DB
        try {

            const product = await Product.create(testProduct);
            testProductId = product.id;
        } catch (error) {
            console.log("Failed creating test product from Mongoose...: ", error);
            return
        }
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it('should return status 200 for GET /api/products', async () => {
        const response = await request(app).get('/api/products/');
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject([testProduct]);
    });

    it('should return test product for GET with params /api/products/:id', async () => {
        const response = await request(app).get(`/api/products/${testProductId}`);
        expect(response.body.name).toEqual('test_product');
        expect(response.status).toBe(200);
    });
});
