const emailValidator = require('email-validator');

const checkUserInfo = (email, password, firstName, lastName, type) => {
    if (
        !email ||
        typeof email !== 'string' ||
        !email.trim() ||
        !emailValidator.validate(email)
    )
        return false;
    if (!password || typeof password !== 'string' || !password.trim())
        return false;
    if (!firstName || typeof firstName !== 'string' || !firstName.trim())
        return false;
    if (!lastName || typeof lastName !== 'string' || !lastName.trim())
        return false;
    if (
        !type ||
        typeof type !== 'string' ||
        (type !== 'instructor' && type !== 'student')
    )
        return false;
    return true;
};

module.exports = checkUserInfo;
