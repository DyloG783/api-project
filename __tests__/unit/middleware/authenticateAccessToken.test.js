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
});
