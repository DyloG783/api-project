import request from 'supertest';
import User from '../../src/models/user.model';
import mongoose from 'mongoose';
import app from '../../src/app';
import hashPassword from '../../src/util/hashPassword';
import jwt from 'jsonwebtoken';

describe('Integration - User route & authorization Tests', () => {

    let testUser: any;
    let access_token_user: string;
    let access_token_admin: string;

    beforeAll(async () => {

        // connect to testinstance db for particular testfile
        try {
            await mongoose.connect(`${process.env.MONGOOSE_DEV_CONNECTION}/users`);

        } catch (error) {
            console.log("Failed connecting to MONGOOSE_DEV_CONNECTION auth:  ", error);
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
                process.env.ACCESS_TOKEN_SECRET!,
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
                process.env.ACCESS_TOKEN_SECRET!,
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

        let csrf: string;

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

        describe('getUsers test GET /api/user/', () => {

            it('should return status 200 for admin authenticated user for GET /api/user/', async () => {
                const response = await request(app).get('/api/user/')
                    .set('authorization', `Bearer ${access_token_admin}`)
                    .send({
                        "csrf": csrf
                    });

                expect(response.status).toBe(200);
                expect(response.body[0]).toMatchObject({
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
                expect(response.text).toEqual("No ADMIN role found on user");
            });
        });
    });
});
