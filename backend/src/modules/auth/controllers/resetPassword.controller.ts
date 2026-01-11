import type { Context } from 'hono';

export const authResetPasswordController = async (c: Context) => {
	/**
	 * Responsible for:
	 * - reading forgotpassword data
	 * - calling validation
	 * - calling service
	 * - returning response
	 */

	return c.json({
		message: 'Reset Pass route works!',
	});
};
