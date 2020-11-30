const { getUserByEmail } = require('../data/users');
const bcrypt = require('bcrypt');

const authorize = async (email, password) => {
    const userLookup = await getUserByEmail({ email });
    if (userLookup.error) return userLookup;
    const user = userLookup.user;
    if (await bcrypt.compare(password, user.password)) {
        return {
            statusCode: 200,
        };
    } else {
        return {
            statusCode: 401,
            error: 'Invalid email or password!',
        };
    }
};

module.exports = authorize;
