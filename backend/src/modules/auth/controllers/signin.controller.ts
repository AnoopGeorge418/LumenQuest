import type { Context } from 'hono';

export const authSignInController = async (c: Context) => {
	/**
	 * Responsible for:
	 * - reading signin data
	 * - calling validation
	 * - calling service
	 * - returning response
	 */

	return c.json({
		message: 'SignIn route works!',
	});
};
