export class AppError extends Error {
	/**
	 * Responsible for Catching all the error messages with status code
	 */

	statusCode: number;

	constructor(message: string, statusCode = 400) {
		super(message);
		this.statusCode = statusCode;
	}
}
