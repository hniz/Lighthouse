const express = require('express');
const { authorize, generateToken } = require('../auth');
const Router = express.Router();
const { modifyUser } = require('../data/users');

Router.get('/', async (req, res) => {
    if (req.isAuthorized) res.redirect('/dashboard');
    else {
        res.render('login', {
            title: 'Log in to Lighthouse',
            redirect: req.query.redirect,
        });
    }
});

Router.post('/', async (req, res) => {
    const email = req.body['login-email'];
    const password = req.body['login-password'];
    const authorizationResult = await authorize(email, password);
    if (authorizationResult.error) {
        return res.status(authorizationResult.statusCode).render('login', {
            title: 'Log in to Lighthouse',
            invalid: true,
        });
    } else {
        const token = await generateToken();
        const result = await modifyUser({ email, token });
        if (result.error) {
            return res.status(result.statusCode).render('login', {
                title: 'Log in to Lighthouse',
                error: true,
            });
        } else {
            req.session.token = token;
            const redirectUrl = req.body['redirect-url'];
            if (redirectUrl) return res.redirect(redirectUrl);
            else return res.redirect('/dashboard');
        }
    }
});

module.exports = Router;
