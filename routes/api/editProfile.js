const express = require('express');
const { getUserByToken, modifyUser } = require('../../data/users');
const Router = express.Router();

Router.post('/', async (req, res) => {
    const userLookup = await getUserByToken(req.session.token);
    if (userLookup.error) {
        return res
            .status(userLookup.statusCode)
            .json({ error: userLookup.error });
    }
    const firstName = req.body['first-name'];
    const lastName = req.body['last-name'];
    const description = req.body.description;
    const result = await modifyUser({
        email: userLookup.user.email,
        firstName,
        lastName,
        description,
    });
    if (result.error) {
        return res.status(result.statusCode).json({ error: result.error });
    } else {
        return res.status(200).send();
    }
});

module.exports = Router;
