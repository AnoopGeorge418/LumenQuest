import { AppError } from "../../../middlewares/appError.middleware";
import { generateRandomStrongPassword } from "../../../utils/generateStrongPassword";

export const signUpAuthService = async ( data: any ) => {
    
    // TODO: Todos for this serverice to work seamlessly
    // 1. Connect to db
    // 2. check if email and username available
    // 3. if yes throw error
    // 4. if no -> create users with { id, role -> user, hashedStrongPassword, emailVerified -> false, userVerified -> false, createdAt, updatedAt }
    // sends verification email
    // token - to verified

    const users: any[] = []

    const { userName, email } = data;

    // Checking user name availability
    const userNameExists = users.find(
        ( u ) => u.userName = userName
    )

    if ( userNameExists ) throw new AppError("Username already exists", 409)

    // Checking email availability
    const userEmailExists = users.find(
        ( u ) => u.email = email
    )

    if ( userEmailExists ) throw new AppError("Email already exists! try signing in.", 409)

    // Creating a strong system password
    let password = generateRandomStrongPassword()

    // User Role - default "user"
    const role = 'user'

    const newUser = {
        id: users.length + 1,
        userName,
        email,
        password,
        role
    }

    users.push(newUser)

    return {
        id: newUser.id,
        userName: newUser.userName,
        email: newUser.email
    }
}

