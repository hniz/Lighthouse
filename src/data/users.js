const collections = require('../config/mongoCollections');
const checkUserInfo = require('../helpers/check_user_info');
const bcrypt = require('bcrypt');

const create = async ({ email, firstName, lastName, password, type }) => {
    const users = await collections.users();
    if (checkUserInfo(email, password, firstName, lastName, type)) {
        const userLookup = await users.findOne({ email });
        if (!userLookup) {
            users.insertOne({
                email,
                fullName: {
                    firstName,
                    lastName,
                },
                type,
                posts: [],
                comments: [],
                classes: [],
                hashedPassword: await bcrypt.hash(password, 8),
            });
            return {
                statusCode: 201,
            };
        } else {
            return {
                error: 'User already exists.',
                statusCode: 400,
            };
        }
    } else {
        return {
            error: 'Missing one or more fields.',
            statusCode: 400,
        };
    }
};

module.exports = {
    create,
};
