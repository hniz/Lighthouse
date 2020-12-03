const { getUserByToken } = require('../data/users');

const checkToken = async (req, res, next) => {
    if (req.session.token) {
        const token = req.session.token;
        const lookup = await getUserByToken(token);
        if (lookup.error) {
            req.session.destroy();
        } else if (lookup.user.type === 'instructor') {
            req.session.instructor = true;
        }
        return next();
    } else return next();
};

module.exports = checkToken;
