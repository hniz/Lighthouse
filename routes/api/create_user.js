const express = require('express');
const Router = express.Router();
const { create } = require('../../data/users');

Router.post('/', async (req, res) => {
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;
    const type = req.body.type;
    const result = await create({ email, firstName, lastName, password, type });
    if (!result.error) {
        res.status(result.statusCode).send();
    } else {
        res.status(result.statusCode).json({ error: result.error });
    }
});

module.exports = Router;
