const { getUserByEmail } = require('../data/users');
const bcrypt = require('bcrypt');

const authorize = async (email, password) => {
    const userLookup = await getUserByEmail(email);
    if (userLookup.error)
        return {
            statusCode: 404,
            error: 'Invalid email or password!',
        };
    const user = userLookup.user;
    if (await bcrypt.compare(password, user.hashedPassword)) {
        return {
            statusCode: 200,
        };
    } else {
        return {
            statusCode: 404,
            error: 'Invalid email or password!',
        };
    }
};

module.exports = authorize;
