import { zIdParamSchema } from '../../src/zod/schema';

/**
 * Importing the zIdParamSchema Zod schema allows testing of the regex which is used across all user inputs.
 * Ensuring we can block malicious input in these tests ensures we do the same in all places a user or system provides string input.
 */
describe('Zod regex blocks malicious input attempts', () => {

    it('Allows valid input', async () => {

        const params = zIdParamSchema.safeParse("validinput");

        expect(params.success).toBeTruthy();
    });

    it('Rejects malicious user input - script tag', async () => {

        const params = zIdParamSchema.safeParse("<script>");

        expect(params.success).toBeFalsy();
    });

    it('Rejects malicious user input - general special characters', async () => {

        const params = zIdParamSchema.safeParse(`'"`);
        expect(params.success).toBeFalsy();
    });

    it('Rejects malicious user input - sql type special characters', async () => {

        const params = zIdParamSchema.safeParse(`)(;:`);
        expect(params.success).toBeFalsy();
    });
});