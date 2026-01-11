import { AppError } from '../../../middlewares/appError.middleware';
import { generateSecurePassword } from '../../../utils/generateStrongPassword';
import { prisma } from '../../../../lib/prisma';
import crypto from 'crypto'

export const signUpAuthService = async (data: any) => {

	const { userName, email } = data;

	// Checking existence of username or email in db
	const userNameExist = await prisma.user.findUnique({
		where: {
			userName
		}
	})
	if ( userNameExist ) throw new AppError("Username already exists!", 409);

	const emailExist = await prisma.user.findUnique({
		where: {
			email
		}
	})
	if ( emailExist ) throw new AppError("Email already exists!", 409);

	// Generating verification token
	const token = crypto.randomUUID();
	const expires = new Date(Date.now() + 15 * 60 * 1000) // 15 min
		
	// Creating unverified user
	const user = await prisma.user.create({
		data: {
			userName,
			email,
			verificationToken: token,
			tokenExpiresAt: expires,
		}
	});

	return user;

}
