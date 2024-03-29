const request = require('supertest');
const jwt = require('jsonwebtoken');
const { hashPassword } = require('../controllers/auth.controller.js');
const Product = require('../models/product.model.js');
const User = require('../models/user.model.js');

const app = require('../index');

describe('Authentication & authorization API Tests', () => {

    let testUser;
    let access_token_user;
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

            //check if test user already exists and delete if so
            existingtestUser = await User.findOne({ username: 'testuser' });
            if (existingtestUser) await User.findOneAndDelete(existingtestUser);

            const hashedPassword = await hashPassword('password');

            testUser = await User.create({
                "username": "testuser",
                "password": hashedPassword
            });

        } catch (error) {
            console.log("Failed creating test user from Mongoose...: ", error)
        }

        try {
            //create valid authentication token for test user role
            access_token_user = jwt.sign(
                {
                    UserInfo: {
                        username: testUser.username,
                        roles: [1]
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: '1m'
                }
            );

            access_token_admin = jwt.sign(
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
            console.log("Failed signing test jwts...: ", error)
        }

        // create test product
        try {

            // check if test data already exists and from db if it already exists
            const testProduct = await Product.findOne({ name: 'test' })
            if (testProduct) {
                await Product.findOneAndDelete(testProduct)
            };

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
            await User.findOneAndDelete({ username: 'testuser' });

        } catch (error) {
            console.log("Failed deleting test product from Mongoose...: ", error)
        }

        // delete test product
        try {
            await Product.deleteOne(testProductToCreate);

        } catch (error) {
            console.log("Failed deleting new test product from Mongoose...: ", error)
        }
    });

    it('should set REFRESH_TOKEN cookie and return 200 upon login POST /api/auth/', async () => {
        const response = await request(app).post('/api/auth/')
            .send({
                "username": `${testUser.username}`,
                "password": `password`
            });

        expect(response.status).toBe(200);
        expect(response.header["set-cookie"][0]).toMatch(/REFRESH_TOKEN/);
    });

    it('should return 401 unauthorised when trying to add a product without authorisation for POST /api/products',
        async () => {
            const response = await request(app).post('/api/products/')
                .send(testProductToCreate);

            expect(response.status).toBe(401);
        }
    );

    it('should return 200 when trying to add a product while authorised for POST /api/products',
        async () => {
            const response = await request(app).post('/api/products/')
                .set('authorization', `Bearer ${access_token_user}`)
                .send(testProductToCreate);

            expect(response.status).toBe(200);
        }
    );

    it('should return 403 with a non admin user for DELETE /api/products/:id', async () => {
        const response = await request(app).delete(`/api/products/${createdProductId}`)
            .set('authorization', `Bearer ${access_token_user}`);

        expect(response.body.message).toEqual('No ADMIN role found on user');
        expect(response.status).toBe(403);
    });

    it('should return 200 with an admin user for DELETE /api/products/:id', async () => {
        const response = await request(app).delete(`/api/products/${createdProductId}`)
            .set('authorization', `Bearer ${access_token_admin}`);

        expect(response.body.message).toEqual('Success deleting product');
        expect(response.status).toBe(200);
    });

    it('should remove refresh token cookie when logging out user on /api/auth/logout',
        async () => {

            //sign in
            const login = await request(app).post('/api/auth/')
                .send({
                    "username": `${testUser.username}`,
                    "password": `password`
                });

            expect(login.status).toBe(200);
            expect(login.header["set-cookie"][0]).toMatch(/REFRESH_TOKEN/);

            //sign out
            const response = await request(app).get('/api/auth/logout');
            expect(response.header["set-cookie"]).toBeUndefined();
        }
    );
});
