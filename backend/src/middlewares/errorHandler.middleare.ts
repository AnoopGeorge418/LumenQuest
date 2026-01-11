import type { Context } from 'hono';
import { AppError } from './appError.middleware';

export const errorHandler = (err: unknown, c: Context) => {
	/**
	 * Responsible for returning all the error message with status codes from AppError
	 */

	// Default values
	let statusCode = 500;
	let message = 'Internal Server Error';

	if (err instanceof AppError) {
		statusCode = err.statusCode;
		message = err.message;
	} else if (err instanceof Error) {
		message = err.message;
	}

	return c.json(
		{
			success: false,
			error: message,
		},
		statusCode as any,
	);
};
