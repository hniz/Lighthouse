const emailValidator = require('email-validator');

const checkUserInfo = (email, password, firstName, lastName, type) => {
    if (!validateEmail(email)) return false;
    if (!validateString(password)) return false;
    if (!validateString(firstName)) return false;
    if (!validateString(lastName)) return false;
    if (!validateType(type)) return false;
    return true;
};

const validateString = (string) => {
    if (!string || typeof string !== 'string' || !string.trim()) {
        return false;
    }
    return true;
};

const validateTagsArray = (tags) => {
    if(!Array.isArray(tags)){
        return false;
    }
    tags.forEach((member) => {
        if(typeof member !== 'string' || member.trim().length ===0  ){
            return false;
        }
    });
    return true;
};

const validateType = (type) => {
    if (
        !type ||
        typeof type !== 'string' ||
        (type !== 'instructor' && type !== 'student')
    )
        return false;
    return true;
};

const validateEmail = (email) => {
    if (
        !email ||
        typeof email !== 'string' ||
        !email.trim() ||
        !emailValidator.validate(email)
    )
        return false;
    return true;
};
const checkUpdatedUserInfo = ({
    firstName,
    lastName,
    password,
    type,
    token,
}) => {
    const changedFields = {};
    let errors = [];
    if (firstName) {
        if (validateString(firstName)) changedFields.firstName = firstName;
        else {
            errors.push('first name');
        }
    }
    if (lastName) {
        if (validateString(lastName)) changedFields.lastName = lastName;
        else {
            errors.push('last name');
        }
    }
    if (password) {
        if (validateString(password)) changedFields.password = password;
        else {
            errors.push('password');
        }
    }
    if (type) {
        if (validateType(type)) changedFields.type = type;
        else {
            errors.push('type');
        }
    }
    if (token) changedFields.token = token;
    if (errors.length > 0) {
        const errorString = `Invalid ${errors.join(', ')}.`;
        return { error: errorString };
    } else return changedFields;
};

module.exports = {
    checkUserInfo,
    checkUpdatedUserInfo,
    validateEmail,
    validateString,
    validateType,
    validateTagsArray,
};
