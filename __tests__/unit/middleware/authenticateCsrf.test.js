const { authenticateCsrf } = require("../../../middleware/authenticateCsrf.middleware");
const { returnCsrfToken } = require('../../../controllers/auth.controller');

jest.mock('../../../controllers/auth.controller');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('authenticateCsrf middleware Tests', () => {

    it('happy path runs the "next" function', () => {

        const next = jest.fn();
        returnCsrfToken.mockReturnValueOnce("test");

        const req = {
            body: { 'csrf': 'test', }
        };
        const res = {};

        authenticateCsrf(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('returns 401 if no csrf token is passed into the body', () => {

        const req = {
            body: {}
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        const next = {};

        authenticateCsrf(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith(`No csrf in body`);
    });

    it('returns 401 if no csrf token is not correct', () => {

        returnCsrfToken.mockReturnValueOnce("test");

        const req = {
            body: { 'csrf': 'incorrect', }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        const next = {};

        authenticateCsrf(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith(`Failed csrf verification between refresh token and instance from auth controller`);
    });
});