const request = require('supertest');
const jwt = require('jsonwebtoken');
const { hashPassword } = require('../controllers/auth.controller.js');
const Product = require('../models/product.model.js');
const User = require('../models/user.model.js');

const app = require('../index');

describe('Authentication & authorization API Tests', () => {

    let testUser;
    const testUserPassword = 'password';
    let token;
    const testProduct = {
        "name": "test",
        "quantity": 10,
        "price": 99.99
    }

    beforeAll(async () => {

        // create test user
        try {
            const hashedPassword = await hashPassword(testUserPassword);

            const user = await User.create({
                "username": "testuser",
                "password": hashedPassword
            });

            testUser = user;

        } catch (error) {
            console.log("Failed creating test user from Mongoose...: ", error)
        }

        //create valid authentication token for test user
        token = jwt.sign({ username: testUser.username }, process.env.SECRET_KEY);
    });

    afterAll(async () => {

        // delete test user
        try {
            await User.findByIdAndDelete(testUser.id);

        } catch (error) {
            console.log("Failed deleting test product from Mongoose...: ", error)
        }

        // delete test product
        try {
            await Product.deleteOne(testProduct);
            console.log("DELETE PRODUCT: ", testProduct.name);

        } catch (error) {
            console.log("Failed deleting test product from Mongoose...: ", error)
        }
    });

    it('should set cookie upon login POST /api/auth/', async () => {
        const response = await request(app).post('/api/auth/')
            .send({
                "username": `${testUser.username}`,
                "password": `${testUserPassword}`
            });

        // Generate JWT token
        // const token = jwt.sign({ username: testUser.username }, process.env.SECRET_KEY);

        expect(response.status).toBe(200);
        expect(response.header["set-cookie"]).toStrictEqual([`SESSIONTOKEN=${token}; Path=/; HttpOnly`]);
    });

    it('should return 401 unauthorised when trying to add a product without authentication for POST /api/products',
        async () => {
            const response = await request(app).post('/api/products/')
                .send({
                    "name": "test",
                    "quantity": 10,
                    "price": 99.99
                });

            expect(response.status).toBe(401);
        }
    );

    it('should return 200 when trying to add a product wile authenticated for POST /api/products',
        async () => {
            const response = await request(app).post('/api/products/')
                .set('Cookie', `SESSIONTOKEN=${token}`)
                .send(testProduct);

            expect(response.status).toBe(200);
        }
    );
});
