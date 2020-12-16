const express = require('express');
const Router = express.Router();

Router.get('/', async (req, res) => {
    if (req.isAuthorized) res.redirect('/dashboard');
    else {
        res.render('login', {
            title: 'Log in to Lighthouse',
            redirect: req.query.redirect,
        });
    }
});



module.exports = Router;
