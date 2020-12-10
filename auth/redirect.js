/*
    The only routes that will not be redirected to auth is /, /login, and /logout
*/

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
        exclude(
            ['/', '/login', '/logout', '/register'],
            async (req, res, next) => {
                if (req.session && req.session.token) {
                    return next();
                } else {
                    return res.redirect(`/login?redirect=${req.path}`);
                }
            }
        )
    );
};

module.exports = redirectRoutes;
