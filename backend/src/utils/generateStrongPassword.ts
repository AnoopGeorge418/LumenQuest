export const generateRandomStrongPassword = () => {
    
    let password = ''

    const symbols: string = '`~!@#$%^&*()_-+=|[]}{;/.,?><}';
    const letters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numbers: string = '1234567890';

    password += `${symbols}${letters}${numbers}`

    return password
    
}
