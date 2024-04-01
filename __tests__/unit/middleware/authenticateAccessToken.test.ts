const jwt = require('jsonwebtoken');
import authenticateAccessToken from "../../../src/middleware/authenticateAccessToken.middleware";

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

        await authenticateAccessToken(req as any, res as any, next);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('should return 401 with no auth header', async () => {

        const req = {
            headers: {}
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = {};

        await authenticateAccessToken(req as any, res as any, next as any);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ "message": "No Bearer auth header found in authenticateAccessToken" });
    });
});
