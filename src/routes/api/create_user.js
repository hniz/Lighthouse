const express = require('express');
const bcrypt = require('bcrypt');
const Router = express.Router();
const collections = require('../../config/mongoCollections');
const checkUserInfo = require('../../helpers/check_user_info');

Router.post('/', async (req, res) => {
    const users = await collections.users();
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;
    const type = req.body.type;
    if (checkUserInfo(email, password, firstName, lastName, type)) {
        const userLookup = await users.findOne({ email });
        if (!userLookup) {
            users.insertOne({
                email,
                fullName: {
                    firstName,
                    lastName,
                },
                type,
                posts: [],
                comments: [],
                classes: [],
                hashedPassword: await bcrypt.hash(password, 8),
            });
            res.status(201).send();
        } else {
            res.status(400).json({ error: 'User already exists.' });
        }
    } else {
        res.status(400).json({ error: 'Missing one or more fields.' });
    }
});

module.exports = Router;
