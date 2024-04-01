
// jest.mock('../../../models/user.model', () => {
//     return {
//         __esModule: true,
//         default: jest.fn(), // called with name i.e. User?
//         findOne: jest.fn(() => return {
//             "username": "testuser",
//             "password": "password"
//         })
//     }

// });
// jest.mock('../../../models/user.model', () => ({
//     User: jest.fn(),
// }));
// jest.unstable_mockModule('../../../models/user.model', () => ({
//     findOne: jest.fn(),
//     findByIdAndUpdate: jest.fn()
// }));

import { expect, jest, it, describe } from '@jest/globals';
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

import { login, refreshToken, logout, returnCsrfToken } from '../../../controllers/auth.controller';
// jest.mock('../../../util/comparePassword');
import comparePassword from '../../../util/comparePassword';
// const comparePassword = require('../../../util/comparePassword');

// import User from '../../../models/user.model';
import type { Model } from 'mongoose';
jest.mock('../../../models/user.model');
let mockedUser: jest.Mocked<typeof Model>
// const User = require('../../../models/user.model');

jest.mock('crypto');
jest.mock('jsonwebtoken');

// Cast to any to suppress TypeScript error
// const MockedUser = User as any;

describe('Auth controller Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    // afterEach(() => {
    //     mockedUser.mockClear();
    // });

    const test_user = {
        "username": "testuser",
        "password": "password"
    }

    it('"returnCsrfToken" returns token stored in controller (initialised to null)', async () => {
        const csrf = returnCsrfToken();
        expect(csrf).toBe(null);
    });

    describe('Login function Tests', () => {

        it(`login updates csrf token and sends in JSON body & "returnCsrfToken" func`, async () => {

            mockedUser.findOne.mockImplementationOnce(() => {
                return {
                    "username": "testuser",
                    "password": "password"
                }
            });

            mockedUser.findByIdAndUpdate.mockImplementationOnce(() => {
                return
            });

            comparePassword.mockImplementationOnce(() => {
                return true;
            });

            crypto.randomUUID.mockImplementationOnce(() => {
                return "test_csrf_token";
            });

            jwt.sign.mockImplementation(() => {
                return;
            });

            const req = {
                body: test_user
            };
            const res = {
                cookie: jest.fn(),
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await login(req as any, res as any);

            console.log("res.jsdon", returnCsrfToken())

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.cookie).toHaveBeenCalledTimes(1);
            expect(returnCsrfToken()).toBe('test_csrf_token');
            expect(res.json).toHaveBeenCalledWith({ csrfToken: 'test_csrf_token' });
        });

        it(`login returns 400 if 'username' is not in request body`, async () => {

            const req = {
                body: {
                    "password": "password"
                }
            };
            const res = {
                cookie: jest.fn(),
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await login(req as any, res as any);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.cookie).toHaveBeenCalledTimes(0);

            expect(res.json).toHaveBeenCalledWith({ "message": "Missing email or password from login request" });
        });

        it(`login returns 400 if 'password' is not in request body`, async () => {

            const req = {
                body: {
                    "username": "testuser"
                }
            };
            const res = {
                cookie: jest.fn(),
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await login(req as any, res as any);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.cookie).toHaveBeenCalledTimes(0);

            expect(res.json).toHaveBeenCalledWith({ "message": "Missing email or password from login request" });
        });

        it(`login returns 404 if user does not exist in db`, async () => {

            mockedUser.findOne.mockImplementationOnce(() => {
                return undefined;
            });

            const req = {
                body: test_user
            };
            const res = {
                cookie: jest.fn(),
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await login(req as any, res as any);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.cookie).toHaveBeenCalledTimes(0);
            expect(res.json).toHaveBeenCalledWith({ "message": "No user with this username found in db" });
        });

        it(`login returns 401 password does not match hashed db`, async () => {

            mockedUser.findOne.mockImplementationOnce(() => {
                return {
                    "username": "testuser",
                    "password": "password"
                };
            });

            comparePassword.mockImplementationOnce(() => {
                return false;
            });

            const req = {
                body: test_user
            };
            const res = {
                cookie: jest.fn(),
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await login(req as any, res as any);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.cookie).toHaveBeenCalledTimes(0);
            expect(res.json).toHaveBeenCalledWith({ "message": "Incorrect password" });
        });

        it(`login creates REFRESH_TOKEN cookie in response`, async () => {

            mockedUser.findOne.mockImplementationOnce(() => {
                return {
                    "username": "testuser",
                    "password": "password"
                };
            });

            comparePassword.mockImplementationOnce(() => {
                return true;
            });

            jwt.sign.mockImplementation(() => {
                return null;
            });

            crypto.randomUUID.mockImplementationOnce(() => {
                return "test_csrf_token";
            });

            const req = {
                body: test_user
            };
            const res = {
                cookie: jest.fn(),
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await login(req as any, res as any);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({ csrfToken: 'test_csrf_token', access_token: null });
            expect(res.cookie).toHaveBeenCalledTimes(1);
            expect(res.cookie).toHaveBeenCalledWith("REFRESH_TOKEN", null, { "httpOnly": true, "maxAge": 86400000, "sameSite": "strict", "secure": true });
        });
    });

    describe('refreshToken function Tests', () => {

        it(`returns 401 if no cookie called REFRESH_TOKEN exists`, async () => {

            const req = {
                cookies: []
            };
            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            await refreshToken(req as any, res as any);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledTimes(0);
            expect(res.send).toHaveBeenCalledWith("No cookie called 'REFRESH_TOKEN' found");
        });

        it(`returns 200 and access token happy path`, async () => {

            mockedUser.findOne.mockImplementationOnce(() => {
                return test_user;
            });

            jwt.sign.mockImplementation(() => {
                return null;
            });
            jwt.verify.mockImplementation(() => {
                return 'test_token';
            });

            const req = {
                cookies: { REFRESH_TOKEN: "null" }
            };
            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
                // send: jest.fn()
            };

            await refreshToken(req as any, res as any);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ accessToken: null });
        });
    });

    describe('logout function Tests', () => {
        it(`returns 200 and calls clearCookie happy path`, async () => {

            mockedUser.findOne.mockImplementationOnce(() => {
                return {};
            });

            mockedUser.findByIdAndUpdate.mockImplementationOnce(() => {
                return {};
            });

            const req = {
                cookies: { REFRESH_TOKEN: "null" }
            };
            const res = {
                sendStatus: jest.fn(),
                clearCookie: jest.fn()
            };

            await logout(req as any, res as any);

            expect(res.sendStatus).toHaveBeenCalledWith(200);
            expect(res.clearCookie).toHaveBeenCalledTimes(1);
        });

        it(`returns 204 if no cookie named REFRESH_TOKEN exists`, async () => {

            const req = {
                cookies: []
            };
            const res = {
                sendStatus: jest.fn()
            };

            await logout(req as any, res as any);

            expect(res.sendStatus).toHaveBeenCalledWith(204);
        });
    });
});


