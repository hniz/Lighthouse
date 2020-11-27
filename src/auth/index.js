const redirectRoutes = require('./redirect');

const configAuth = (app) => {
    redirectRoutes(app);
};

module.exports = configAuth;
