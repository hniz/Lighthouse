const redirectRoutes = require('./redirect');
const authorize = require('./authorize');
const generateToken = require('./generateToken');

const configAuth = (app) => {
    redirectRoutes(app);
};

module.exports = {
    configAuth,
    authorize,
    generateToken,
};
