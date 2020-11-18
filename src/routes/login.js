const express = require('express');
const Router = express.Router();

Router.get('/', async (req, res) => {
    res.render('login', { title: 'Log in to Lighthouse' });
});

module.exports = Router;
