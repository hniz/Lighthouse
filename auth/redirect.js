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
                if (req.session.token) {
                    return next();
                } else {
                    req.redirectUrl = req.baseUrl;
                    return res.redirect('/login');
                }
            }
        )
    );
};

module.exports = redirectRoutes;
