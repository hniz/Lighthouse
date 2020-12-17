const express = require('express');
const { getUserByToken, deleteUser } = require('../../data/users');
const Router = express.Router();
const xss = require('xss');

Router.post('/', async(req, res) => {
    const userLookup = await getUserByToken(req.session.token);
    if (userLookup.error) {
        return res
            .status(userLookup.statusCode)
            .json({ error: userLookup.error });
    }
    const emailAddress = xss(req.body['email']);
    const result = await deleteUser(emailAddress);
    if(result.error){
        return res.status(result.statusCode).json({error: result.error});
    } else {
        return res.status(200).send();
    }

});

module.exports = Router;