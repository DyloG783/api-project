const request = require('supertest');
const jwt = require('jsonwebtoken');
const { hashPassword } = require('../../util/hashPassword.js');
const Product = require('../../models/product.model.js');
const User = require('../../models/user.model.js');
const mongoose = require('mongoose');
const { app } = require('../../app');

describe('Authentication & authorization API Tests', () => {

    let testUser;
    let access_token_user;
    let access_token_admin;
    let access_token_corrupt;

    beforeAll(async () => {

        // connect to testinstance db for particular testfile
        try {
            await mongoose.connect(`${process.env.MONGOOSE_DEV}/auth`);

            // console.log("Success connecting to MONGOOSE_DEV");

        } catch (error) {
            console.log("Failed connecting to MONGOOSE_DEV auth:  ", error);
            return;
        }

        // create test user
        try {
            const hashedPassword = await hashPassword('password');
            testUser = await User.create({
                "username": "testuser",
                "password": hashedPassword
            });

        } catch (error) {
            console.log("Failed creating test user from Mongoose...: ", error)
        }

        //create access tokens for test user
        try {
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

            access_token_corrupt = jwt.sign(
                {
                    UserInfo: {
                        username: testUser.username,
                        roles: [1]
                    }
                },
                "notValidAccessTokenSecret",
                {
                    expiresIn: '1m'
                }
            );

        } catch (error) {
            console.log("Failed signing test jwts...: ", error)
        }


    });

    afterAll(async () => {

        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });



    describe('product related auth tests', () => {

        let createdProductId;
        const testProductToCreate = {
            "name": "testNew",
            "quantity": 10,
            "price": 99.99
        }

        beforeAll(async () => {
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
        });

        it.skip('should return 401 unauthorised when trying to add a product without csrf in body for POST /api/products',
            async () => {
                const response = await request(app).post('/api/products/')
                    .set('authorization', `Bearer ${access_token_user}`)
                    .send({
                        "data": testProductToCreate
                    });

                expect(response.status).toBe(401);
                expect(response.error.text).toEqual('No csrf in body');

            }
        );

        // JWT, & DB
        it('should return updated test PRODUCT name with authenticated user for PUT /api/products/:id (DB test)', async () => {
            const response = await request(app).put(`/api/products/${createdProductId}`)
                .set('authorization', `Bearer ${access_token_user}`)
                .send({ "name": "updated" });

            expect(response.body.name).toBe('updated');
            expect(response.body._id).toBe(createdProductId);
            expect(response.status).toBe(200);
        });

        it.skip('should return 401 for unauthenticated user on PUT /api/products/:id', async () => {
            const response = await request(app).put(`/api/products/${createdProductId}`)
                .send({ "name": "updated" });

            expect(response.error.text).toEqual('No Bearer auth header found in "authenticateAccessToken"');
            expect(response.status).toBe(401);
        });

        // JWT, & DB
        it('should return 403 with a non admin user for DELETE /api/products/:id (JWT test)', async () => {
            const response = await request(app).delete(`/api/products/${createdProductId}`)
                .set('authorization', `Bearer ${access_token_user}`);

            expect(response.error.text).toEqual('No ADMIN role found on user');
            expect(response.status).toBe(403);
        });

        // JWT, & DB & user roles
        it('should return 200 with an admin user for DELETE /api/products/:id (JWT test)', async () => {
            const response = await request(app).delete(`/api/products/${createdProductId}`)
                .set('authorization', `Bearer ${access_token_admin}`);

            expect(response.body.message).toEqual('Success deleting product');
            expect(response.status).toBe(200);
        });

        describe('Login route tests POST /api/auth/', () => {

            it('should set REFRESH_TOKEN cookie and return 200 upon login POST /api/auth/', async () => {
                const response = await request(app).post('/api/auth/')
                    .send({
                        "username": `${testUser.username}`,
                        "password": `password`
                    });

                expect(response.status).toBe(200);
                expect(response.header["set-cookie"][0]).toMatch(/REFRESH_TOKEN/);
            });
        });

        describe('Refresh route tests GET /api/auth/refresh', () => {
        });

        describe('Logout route tests GET /api/auth/logout', () => {

            it.skip('should remove refresh token cookie when logging out user on /api/auth/logout',
                async () => {
                    //sign in
                    const login = await request(app).post('/api/auth/')
                        .send({
                            "username": `${testUser.username}`,
                            "password": `password`
                        });

                    expect(login.status).toBe(200);
                    expect(login.header["set-cookie"][0]).toMatch(/REFRESH_TOKEN/);

                    // const csrf = login.body.csrfToken;

                    //sign out
                    const response = await request(app).get('/api/auth/logout')
                        .set('Cookie', `REFRESH_TOKEN=${refresh_token}`);
                    console.log(response)
                    console.log("REFRESH TOKEN", refresh_token)
                    expect(response.header["set-cookie"]).toBeUndefined();
                    expect(response.status).toBe(200);
                }
            );

            it('should return 204 when logging out user with no refresh token (signed out) on /api/auth/logout',
                async () => {

                    //sign out
                    const response = await request(app).get('/api/auth/logout');

                    expect(response.header["set-cookie"]).toBeUndefined();
                    expect(response.status).toBe(204);
                }
            );
        });

        describe('CSRF related PRODUCT tests', () => {

            let csrf;
            let refresh_token;

            beforeAll(async () => {
                // Generate JWT refresh token
                refresh_token = jwt.sign({
                    "RefreshInfo": {
                        username: testUser.username
                    }
                },
                    process.env.REFRESH_TOKEN_SECRET, {
                    expiresIn: '1d'
                });
            });

            beforeEach(async () => {

                //sign in
                const login = await request(app).post('/api/auth/')
                    .send({
                        "username": `${testUser.username}`,
                        "password": `password`
                    });

                expect(login.status).toBe(200);
                expect(login.header["set-cookie"][0]).toMatch(/REFRESH_TOKEN/);

                csrf = login.body.csrfToken;
            });


            it('should return 200 when trying to add a PRODUCT while authorised for POST /api/products',
                async () => {
                    const response = await request(app).post('/api/products/')
                        .set('authorization', `Bearer ${access_token_user}`)
                        .send({
                            "data": testProductToCreate,
                            "csrf": csrf
                        });

                    // console.log(response.body)
                    expect(response.status).toBe(200);
                }
            );

            it('should return 401 unauthorised when trying to add a PRODUCT without access token in auth header for POST /api/products',
                async () => {
                    const response = await request(app).post('/api/products/')
                        .send({
                            "data": testProductToCreate,
                            "csrf": csrf
                        });

                    expect(response.status).toBe(401);
                    expect(response.error.text).toEqual('No Bearer auth header found in \"authenticateAccessToken\"');
                }
            );

            it('should return 403 unauthorised when trying to add a PRODUCT with CORRUPT access token in auth header for POST /api/products',
                async () => {
                    const response = await request(app).post('/api/products/')
                        .set('authorization', `Bearer ${access_token_corrupt}`)
                        .send({
                            "data": testProductToCreate,
                            "csrf": csrf
                        });

                    expect(response.status).toBe(403);
                    expect(response.error.text).toEqual('Invalid access token');
                }
            );
        });
    });
});


