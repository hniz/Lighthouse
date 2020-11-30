const express = require('express');
const { authorize, generateToken } = require('../auth');
const Router = express.Router();
const { modifyUser } = require('../data/users');

Router.get('/', async (req, res) => {
    res.render('login', { title: 'Log in to Lighthouse' });
});

Router.post('/', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const authorizationResult = await authorize(email, password);
    if (authorizationResult.error) {
        return res.status(authorizationResult.statusCode).render('login', {
            title: 'Log in to Lighthouse',
            invalid: true,
        });
    } else {
        const token = generateToken();
        const result = await modifyUser({ email, token });
        if (result.error) {
            return res.status(result.statusCode).render('login', {
                title: 'Log in to Lighthouse',
                error: true,
            });
        } else {
            req.session.token = token;
            return res.redirect(req.redirectUrl);
        }
    }
});

module.exports = Router;
