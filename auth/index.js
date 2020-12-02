const redirectRoutes = require('./redirect');
const authorize = require('./authorize');
const generateToken = require('./generateToken');
const redirectAuthRoutes = require('./authRedirect');
const checkToken = require('./checkToken');

const configAuth = (app) => {
    app.use(checkToken);
    redirectAuthRoutes(app);
    redirectRoutes(app);
};

module.exports = {
    configAuth,
    authorize,
    generateToken,
};
