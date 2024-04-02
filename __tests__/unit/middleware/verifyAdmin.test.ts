const jwt = require('jsonwebtoken');
import verifyAdmin from "../../../src/middleware/verifyAdmin.middleware";
import { jest } from '@jest/globals';

jest.mock('jsonwebtoken');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Unit - "verifyAdmin" middleware tests', () => {

    it('happy path runs the "next" function', () => {

        const next = jest.fn();
        jwt.verify.mockImplementationOnce(next);

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
});