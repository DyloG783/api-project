const request = require('supertest');
const jwt = require('jsonwebtoken');
const { hashPassword } = require('../controllers/auth.controller.js');
const Product = require('../models/product.model.js');
const User = require('../models/user.model.js');

const app = require('../index');

describe('Authentication & authorization API Tests', () => {

    let testUser;
    const testUserPassword = 'password';
    let access_token;
    // let refresh_token;
    let createdProductId;
    const testProductToCreate = {
        "name": "testNew",
        "quantity": 10,
        "price": 99.99
    }

    // const testProductToDelete = {
    //     "name": "test2",
    //     "quantity": 10,
    //     "price": 99.99
    // }

    beforeAll(async () => {

        // create test user
        try {
            const hashedPassword = await hashPassword(testUserPassword);

            testUser = await User.create({
                "username": "testuser",
                "password": hashedPassword
            });

        } catch (error) {
            console.log("Failed creating test user from Mongoose...: ", error)
        }

        try {
            //create valid authentication token for test user
            access_token = jwt.sign(
                {
                    UserInfo: {
                        username: testUser.username,
                        roles: [1, 2]
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: '1m'
                }
            );

        } catch (error) {
            console.log("Signing test jwt...: ", error)
        }

        // create test product
        try {
            const createdProduct = await Product.create({
                "name": "test",
                "quantity": 10,
                "price": 99.99
            });
            createdProductId = createdProduct.id;
        } catch (error) {
            console.log("Failed creating test product from Mongoose...: ", error)
        }

        // // Generate JWT refresh token
        // refresh_token = jwt.sign({ username: testUser.username }, process.env.REFRESH_TOKEN_SECRET, {
        //     expiresIn: '1d'
        // });
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
            await Product.deleteOne(testProductToCreate);

        } catch (error) {
            console.log("Failed deleting new test product from Mongoose...: ", error)
        }

        // delete test product
        try {
            await Product.findByIdAndDelete(testProductId);

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

        expect(response.status).toBe(200);
        // expect(response.header["set-cookie"]).toStrictEqual([`SESSIONTOKEN=${token}; Path=/; HttpOnly`]);
        expect(response.header["set-cookie"]).toBeDefined();
    });

    it('should return 401 unauthorised when trying to add a product without authentication for POST /api/products',
        async () => {
            const response = await request(app).post('/api/products/')
                .send(testProductToCreate);

            expect(response.status).toBe(401);
        }
    );

    it('should return 200 when trying to add a product while authenticated for POST /api/products',
        async () => {
            const response = await request(app).post('/api/products/')
                .set('authorization', `Bearer ${access_token}`)
                .send(testProductToCreate);

            // console.log("access token: ", access_token);
            // console.log("response: ", response);

            // expect(response.header["authorization"]).toBeDefined();
            expect(response.status).toBe(200);
        }
    );

    it('should return 200 and success delete message for DELETE /api/products/:id', async () => {
        const response = await request(app).delete(`/api/products/${createdProductId}`)
            .set('authorization', `Bearer ${access_token}`);

        expect(response.body.message).toEqual('Success deleting product');
        expect(response.status).toBe(200);
    });

    it('should remove refresh token cookie when logging out user on /api/auth/logout',
        async () => {

            //sign in
            const login = await request(app).post('/api/auth/')
                .send({
                    "username": `${testUser.username}`,
                    "password": `${testUserPassword}`
                });

            // console.log("LOGIN: ", login)
            expect(login.status).toBe(200);
            expect(login.header["set-cookie"]).toBeDefined();


            // console.log("STATUS1: ", login.status)
            const response = await request(app).get('/api/auth/logout');

            expect(response.header["set-cookie"]).toBeUndefined();

            // console.log("STATUS2: ", response.status)
            // expect(response.status).toBe(200);
        }
    );


});
