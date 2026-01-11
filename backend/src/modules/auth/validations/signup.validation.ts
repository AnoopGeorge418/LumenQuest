import { AppError } from '../../../middlewares/appError.middleware';

export const signUpAuthValidator = (data: any) => {
	if ( !data || typeof data !== "object" ) throw new AppError('Request Data is Missing or invalid!', 400);

	const { userName, email } = data;

	// Username Validation
	if ( !userName ) throw new AppError('Username is required!', 400);
	if ( typeof userName  !== "string" ) throw new AppError("Username must be a string", 400);
	
	const trimmedUserName = userName.trim()
	if ( trimmedUserName.length < 4 ) throw new AppError('Username must be atleast 4 character long!', 400);

	
	// Email Validation
	if ( !email ) throw new AppError('Email is required!', 400);
	if ( typeof email !== 'string' ) throw new AppError('Email must be a string', 400);

	const trimmedEmail = email.trim();
	if ( !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail) ) throw new AppError("Please enter a valid email address");

	// Normalizing data
	data.userName = trimmedUserName;
	data.email = trimmedEmail;

	return true;
	
};
