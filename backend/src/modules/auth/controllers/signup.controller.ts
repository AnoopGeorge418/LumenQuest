import type { Context } from 'hono';
import { signUpAuthValidator } from '../validations/signup.validation';
import { signUpAuthService } from '../services/signup.service';

export const authSignUpController = async (c: Context) => {
	/**
	 * Responsible for:
	 * - fetching user inputs from frontend
	 * - calling validation
	 * - calling service
	 * - returning response to frontend
	 */

	const body = await c.req.json();

	// Calling validation
	signUpAuthValidator(body);

	// Calling service
	const user = await signUpAuthService(body);

	return c.json(
		{
			message: 'User account created successfully!',
			data: user,
		},
		201,
	);
};
