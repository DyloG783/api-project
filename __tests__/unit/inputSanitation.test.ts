import { zStringSanitization } from '../../src/zod/schema';

/**
 * Importing the zIdParamSchema Zod schema allows testing of the regex which is used across all user inputs.
 * Ensuring we can block malicious input in these tests ensures we do the same in all places a user or system provides string input.
 */
describe('Zod regex blocks malicious input attempts', () => {

    it('Allows valid input', async () => {

        const params = zStringSanitization.safeParse("validinput");

        expect(params.success).toBeTruthy();
    });

    it('Rejects malicious user input - script tag', async () => {

        const params = zStringSanitization.safeParse("<script>");

        expect(params.success).toBeFalsy();
    });

    it('Rejects malicious user input - general special characters', async () => {

        const params = zStringSanitization.safeParse(`http://malicious.com`);
        expect(params.success).toBeFalsy();
    });

    it('Rejects malicious user input - mongo query type special characters', async () => {

        const params = zStringSanitization.safeParse(`;Product.findByIdAndDelete(test373rh7wr7y37w38rw)`);
        expect(params.success).toBeFalsy();
    });

    it('Rejects malicious user input - sql query type special characters', async () => {

        const params = zStringSanitization.safeParse(`SELECT id FROM users WHERE username='user' AND password='pass' OR 5=5'`);
        expect(params.success).toBeFalsy();
    });
});