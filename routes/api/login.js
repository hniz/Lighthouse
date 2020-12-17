const { authorize, generateToken } = require('../../auth');
const { modifyUser } = require('../../data/users');
const Router = require('express').Router();
const xss = require('xss');

Router.post('/', async (req, res) => {
    const email = xss(req.body['login-email']);
    const password = xss(req.body['login-password']);
    const lowercaseEmail = email && email.toLowerCase();

    const authorizationResult = await authorize(lowercaseEmail, password);
    if (authorizationResult.error) {
        return res.status(authorizationResult.statusCode).json({error: authorizationResult.error});
    } else {
        const token = await generateToken();
        const result = await modifyUser({ email:lowercaseEmail, token });
        if (result.error) {
            return res.status(result.statusCode).json({error: result.error});
        } else {
            req.session.token = token;
            const redirectUrl = xss(req.body['redirect-url']);
            if (redirectUrl) return res.redirect(redirectUrl);
            else return res.redirect('/dashboard');
        }
    }
});

module.exports = Router;