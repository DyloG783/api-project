const jwt = require('jsonwebtoken');
const { authenticateAccessToken } = require("../../../middleware/authenticateAccessToken.middleware.js");

jest.mock('jsonwebtoken');

beforeEach(() => {
    jest.clearAllMocks();
});


describe('authenticateAccessToken middleware Tests', () => {

    it('should handle happy path with auth header & mocked token', async () => {

        const next = jest.fn();
        jwt.verify.mockImplementationOnce(next);

        const req = {
            headers: { 'Authorization': 'Bearer your_token', }
        };
        const res = {};

        await authenticateAccessToken(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('should return 401 with no auth header', async () => {

        const req = {
            headers: {}
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        const next = {};

        await authenticateAccessToken(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith(`No Bearer auth header found in "authenticateAccessToken"`);
    });

    // perhaps don't need to test third party app, use case managed in integrations tests anyway!
    it.skip('should return 403 with invalid access token auth header', () => {

        jwt.verify.mockImplementationOnce(() => {
            throw new Error('Test error');
        });

        const req = {
            headers: { 'Authorization': 'Bearer incorrect', }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        const next = {};

        authenticateAccessToken(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith("Invalid access token");
    });
});
