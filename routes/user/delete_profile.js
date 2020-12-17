const express = require('express');
const { getUserByToken } = require('../../data/users');
const Router = express.Router();

Router.get('/', async (req, res) => {
    const userLookup = await getUserByToken(req.session.token);
    if (userLookup.error) {
        return res
            .status(userLookup.statusCode)
            .render('error', { title: 'Error', error: userLookup.error });
    }
    return res.render('delete_profile', {
        title: 'Delete Profile',
        user: userLookup.user,
    });
});

module.exports = Router;
