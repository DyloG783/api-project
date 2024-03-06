const request = require('supertest');
const jwt = require('jsonwebtoken');
const { hashPassword } = require('../controllers/auth.controller.js');

const app = require('../index');
const User = require('../models/user.model.js');

describe('Authentication API Tests', () => {

    let testUser;
    const testUserPassword = 'password';

    beforeAll(async () => {

        // create test user
        try {
            const hashedPassword = await hashPassword(testUserPassword);

            const user = await User.create({
                "username": "testuser",
                "password": hashedPassword
            });

            testUser = user;

            console.log(testUser)

        } catch (error) {
            console.log("Failed creating test user from Mongoose...: ", error)
        }
    });

    afterAll(async () => {

        // delete test user
        try {
            await User.findByIdAndDelete(testUser.id);

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
        const token = jwt.sign({ username: testUser.username }, process.env.SECRET_KEY);

        console.log(testUser.password)

        expect(response.status).toBe(200);
        expect(response.header["set-cookie"]).toStrictEqual([`SESSIONTOKEN=${token}; Path=/; HttpOnly`]);
    });
});
