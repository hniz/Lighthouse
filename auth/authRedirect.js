/*
    An authenticated user should not see these pages.
*/

const redirectIfAuthorized = async (req, res, next) => {
    if (req.session.token) {
        return res.redirect('/dashboard');
    } else next();
};

const redirectAuthRoutes = (app) => {
    app.use('/login', redirectIfAuthorized);
    app.use('/register', redirectIfAuthorized);
};

module.exports = redirectAuthRoutes;
