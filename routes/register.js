const express = require('express');
const Router = express.Router();
const { create } = require('../data/users');

Router.get('/', (req, res) => {
    res.status(200).render('register', { title: 'Register for Lighthouse' });
});

Router.post('/', async (req, res) => {
    const email = req.body['register-email'];
    const firstName = req.body['register-first'];
    const lastName = req.body['register-last'];
    const password = req.body['register-password'];
    const type = req.body['register-type'];
    const lowercaseEmail = email && email.toLowerCase();
    const result = await create({ email: lowercaseEmail, firstName, lastName, password, type });
    if (result.error) {
        return res.status(result.statusCode).json({error: result.error});
    } else {
        return res.status(200).send();
    }
});

module.exports = Router;
