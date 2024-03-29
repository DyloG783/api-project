const request = require('supertest');
const mongoose = require('mongoose');
const Product = require('../../models/product.model.js');

const { app } = require('../../app');

describe('API Tests', () => {

    let testProductId;

    beforeAll(async () => {

        // connect to testinstance db for particular testfile
        try {
            await mongoose.connect(`${process.env.MONGOOSE_DEV}/products`);
        } catch (error) {
            console.log("Failed connecting to MONGOOSE_DEV products: ", error);
            return;
        }

        // create test product in DB
        try {

            const product = await Product.create({
                "name": "test_product",
                "quantity": 10,
                "price": 99.99
            });
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
        // expect(response.body).to;
    });

    it('should return test product for GET /api/products/:id', async () => {
        const response = await request(app).get(`/api/products/${testProductId}`);
        expect(response.body.name).toEqual('test_product');
        expect(response.status).toBe(200);
    });
});
