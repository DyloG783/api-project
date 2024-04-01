// const jwt = require('jsonwebtoken');
const jwt = require('jsonwebtoken');
import verifyAdmin from "../../../src/middleware/verifyAdmin.middleware";
import { jest } from '@jest/globals';

jest.mock('jsonwebtoken');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('verifyAdmin middleware Tests', () => {

    it('happy path runs the "next" function', () => {

        const next = jest.fn();
        jwt.verify.mockImplementationOnce(next);
        // jwt.verify.mockImplementationOnce(() => {
        //     return;
        // });

        const req = {
            headers: { 'Authorization': 'Bearer your_token', }
        };
        const res = {};

        verifyAdmin(req as any, res as any, next);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('returns 401 when no Bearer token is found in auth header', () => {

        const req = {
            headers: []
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = {};

        verifyAdmin(req as any, res as any, next as any);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'No Bearer auth header found in "verifyAdmin"' });
    });

    // can figure out how to only mock in some cases in the same file
    describe.skip('JWT not mocked to test roles array passed in', () => {

        // beforeEach(() => {
        //     jest.requireActual('jsonwebtoken')
        // });

        // let access_token_user;
        // let access_token_admin;

        // beforeAll(() => {
        //     // jwt.mockRestore();
        //     // jest.requireActual('jsonwebtoken');

        //     // access_token_user = sign(
        //     access_token_user = jwt.sign(
        //         {
        //             UserInfo: {
        //                 username: 'test',
        //                 roles: [1]
        //             }
        //         },
        //         process.env.ACCESS_TOKEN_SECRET,
        //         {
        //             expiresIn: '1m'
        //         }
        //     );

        //     // access_token_admin = sign(
        //     access_token_admin = jwt.sign(
        //         {
        //             UserInfo: {
        //                 username: 'test',
        //                 roles: [1, 2]
        //             }
        //         },
        //         process.env.ACCESS_TOKEN_SECRET,
        //         {
        //             expiresIn: '1m'
        //         }
        //     );
        // });

        it('returns 403 when no Admin role is found in auth header', () => {

            // jest.unmock('jsonwebtoken');
            // jwt.mockImplementationOnce(() => {
            //     return require.requireActual('jsonwebtoken').default();
            // });

            // const jwt = require('jsonwebtoken');
            // jest.requireActual('jsonwebtoken')

            // require('jsonwebtoken').default = jwt.default



            // const req = {
            //     headers: { authorization: `Bearer ${access_token_user}` }
            // };
            // const res = {
            //     status: jest.fn().mockReturnThis(),
            //     send: jest.fn()
            // };
            // const next = {};

            // verifyAdmin(req, res, next);
            // expect(res.status).toHaveBeenCalledWith(403);
            // expect(res.send).toHaveBeenCalledWith({ message: 'No ADMIN role found on user' });
        });
    });
});