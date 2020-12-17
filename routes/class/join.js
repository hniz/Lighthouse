const express = require('express');
const { getUserByToken } = require('../../data/users');
const Router = express.Router();

Router.get('/', async (req, res) => {
    const userLookup = await getUserByToken(req.session.token);
    res.render('join_class', {
        title: 'Join Class',
        loggedIn: req.session.token ? true : false,
        instructor: userLookup.user.type === 'instructor',
    });
});

module.exports = Router;
