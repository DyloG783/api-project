const request = require('supertest');
const app = require('../index');
const Product = require('../models/product.model.js');

describe('API Tests', () => {

    let testProductId;

    beforeAll(async () => {
        await request(app)
            .post('/api/products/')
            .send({
                "name": "test",
                "quantity": 10,
                "price": 99.99
            })
            .then(response => {
                testProductId = response.body._id;
                // console.log("TID: ", testProductId)
            });
    });

    it('should return status 200 for GET /api/products', async () => {
        const response = await request(app).get('/api/products/');
        expect(response.status).toBe(200);
    });

    it('should return test product for GET /api/products/:id', async () => {
        const response = await request(app).get(`/api/products/${testProductId}`);
        expect(response.body.name).toEqual('test');
        expect(response.status).toBe(200);
    });

    it('should return updated test product name for PUT /api/products/:id', async () => {
        const response = await request(app)
            .put(`/api/products/${testProductId}`)
            .send({ "name": "updated" });
        expect(response.body.name).toEqual('updated');
        expect(response.body._id).toEqual(testProductId);
        expect(response.status).toBe(200);

        console.log("Update test body: ", response.body)
    });

    it('should return 200 and success delete message for DELETE /api/products/:id', async () => {
        const response = await request(app).delete(`/api/products/${testProductId}`);
        expect(response.body.message).toEqual('Success deleting product');
        expect(response.status).toBe(200);
    });

    afterAll(async () => {
        try {

            await Product.findByIdAndDelete(testProductId);

        } catch (error) {
            console.log("Failed deleting test product from Mongoose...: ", error)
        }
    });
});
