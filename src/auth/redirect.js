/*
    The only routes that will not be redirected to auth is /, /login, and /logout
*/

const exclude = (routes, middleware) => {
    return function (req, res, next) {
        if (routes.includes(req.baseUrl)) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
};

const redirectRoutes = (app) => {
    app.use(
        exclude(['/', '/login', '/logout'], (req, res, next) => {
            req.redirectUrl = req.baseUrl;
            res.redirect('/login');
            next();
        })
    );
};

module.exports = redirectRoutes;
