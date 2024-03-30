const request = require('supertest');
const User = require('../../models/user.model.js');
const mongoose = require('mongoose');
const { app } = require('../../app');
const { hashPassword } = require('../../util/hashPassword.js');
const jwt = require('jsonwebtoken');

describe('User route & authorization Tests', () => {

    let testUser;
    let access_token_user;
    let access_token_admin;

    beforeAll(async () => {

        // connect to testinstance db for particular testfile
        try {
            await mongoose.connect(`${process.env.MONGOOSE_DEV}/users`);

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

    describe('login related User tests', () => {

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

        // JWT, CSRF & DB
        describe('getUsers test GET /api/user/', () => {

            it('should return status 200 for admin authenticated user for GET /api/user/', async () => {
                const response = await request(app).get('/api/user/')
                    .set('authorization', `Bearer ${access_token_admin}`)
                    .send({
                        "csrf": csrf
                    });

                expect(response.status).toBe(200);
                expect(response._body[0]).toMatchObject({
                    "username": "testuser"
                });
            });

            it('should return status 401 for non admin authenticated user for GET /api/user/', async () => {
                const response = await request(app).get('/api/user/')
                    .set('authorization', `Bearer ${access_token_user}`)
                    .send({
                        "csrf": csrf
                    });

                expect(response.status).toBe(403);
                expect(response.error.text).toEqual("No ADMIN role found on user");
            });
        });
    });
});
