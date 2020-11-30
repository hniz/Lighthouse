/*
    The only routes that will not be redirected to auth is /, /login, and /logout
*/

const { getUserByToken } = require('../data/users');

const exclude = (routes, middleware) => {
    return function (req, res, next) {
        if (routes.includes(req.path)) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
};

const redirectRoutes = (app) => {
    app.use(
        exclude(['/', '/login', '/logout'], async (req, res, next) => {
            if (req.session.token) {
                const lookup = await getUserByToken({
                    token: req.session.token,
                });
                if (lookup.error) {
                    req.session.destroy();
                } else {
                    return next();
                }
            }
            req.redirectUrl = req.baseUrl;
            return res.redirect('/login');
        })
    );
};

module.exports = redirectRoutes;
