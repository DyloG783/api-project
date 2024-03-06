const request = require('supertest');
const jwt = require('jsonwebtoken');
// const mongoose = require('mongoose');

const app = require('../index');
const Product = require('../models/product.model.js');
const User = require('../models/user.model.js');

describe('Authentication API Tests', () => {

    let testProductId;
    let testUser;

    beforeAll(async () => {

        // create test product
        try {
            const product = await Product.create({
                "name": "test",
                "quantity": 10,
                "price": 99.99
            });
            testProductId = product.id;
        } catch (error) {
            console.log("Failed creating test product from Mongoose...: ", error)
        }

        // create test user
        try {
            const user = await User.create({
                "username": "testuser",
                "password": "password"
            });

            testUser = user;

        } catch (error) {
            console.log("Failed creating test user from Mongoose...: ", error)
        }
    });

    afterAll(async () => {

        // delete test product
        try {
            await Product.findByIdAndDelete(testProductId);

        } catch (error) {
            console.log("Failed deleting test product from Mongoose...: ", error)
        }

        // delete test user
        try {
            await User.findByIdAndDelete(testUser.id);

        } catch (error) {
            console.log("Failed deleting test product from Mongoose...: ", error)
        }

        //trying to stop async operations
        // await app.close();
        // mongoose.connection.close(); 
    });

    it('should set cookie uppn login POST /api/auth/', async () => {
        const response = await request(app).post('/api/auth/')
            .send({
                "username": `${testUser.username}`,
                "password": `${testUser.password}`
            });

        // Generate JWT token
        const token = jwt.sign({ username: testUser.username }, 'your_secret_key');

        expect(response.status).toBe(200);
        expect(response.header["set-cookie"]).toStrictEqual([`SESSIONTOKEN=${token}; Path=/; HttpOnly`]);
    });
});
