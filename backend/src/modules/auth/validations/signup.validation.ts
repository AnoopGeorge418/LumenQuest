import { AppError } from "../../../middlewares/appError.middleware"

export const signUpAuthValidator = ( data: any ) => {

    if ( !data ) throw new AppError( "Request Data is Missing!", 400)

    // Username field
    if ( !data.userName  ) {
        throw new AppError("Username is required!", 400)
    } else if ( data.userName.length <= 4) {
        throw new AppError("Username must be more than 4 characters!", 400)
    }

    // Email field
    if ( !data.email ) {
        throw new AppError("Email is required!", 400)
    } else if ( !data.email.includes('@') ) {
        throw new AppError("Please enter a valid email address", 400)
    }


    return true
    
}

