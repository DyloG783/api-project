const jwt = require('jsonwebtoken');
const { verifyAdmin } = require("../../../middleware/verifyAdmin.middleware");

jest.mock('jsonwebtoken');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('verifyAdmin middleware Tests', () => {

    it('happy path runs the "next" function', () => {

        const next = jest.fn();
        jwt.verify.mockImplementationOnce(next);

        const req = {
            headers: { 'Authorization': 'Bearer your_token', }
        };
        const res = {};

        verifyAdmin(req, res, next);
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

        verifyAdmin(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'No Bearer auth header found in "verifyAdmin"' });
    });
});