const express = require('express');
const { getClassByCode, addStudentToClass } = require('../../data/classes');
const Router = express.Router();

Router.get('/', (req, res) => {
    res.render('join_class', {
        title: 'Join Class',
    });
});

Router.post('/', async (req, res) => {
    const code = req.body['class-code'];
    const classLookup = await getClassByCode(code);
    if (classLookup.error) {
        res.render('join_class', {
            title: 'Join Class',
            error: classLookup.error,
        });
    }
    const password = req.body['class-password'];
    if (classLookup.class.password === password) {
        const result = await addStudentToClass({
            studentToken: req.session.token,
            classCode: code,
        });
        if (result.error) {
            res.render('join_class', {
                title: 'Join Class',
                error: classLookup.error,
            });
        } else {
            res.redirect('/dashboard');
        }
    }
});

module.exports = Router;
