const e = require('express');
const { create } = require('../../data/classes');
const Router = e.Router();

Router.post('/', async (req, res) => {
    const token = req.session.token;
    const name = req.body['class-name'];
    const description = req.body['class-description'];
    const result = await create({
        name,
        description,
        instructorToken: token,
    });
    if (result.error) {
        res.status(result.statusCode).render('new_class', {
            title: 'Create new class',
            instructor: req.session.instructor,
        });
    } else {
        res.redirect('/dashboard');
    }
});

Router.get('/', (req, res) => {
    res.status(req.session.instructor ? 200 : 401).render('new_class', {
        title: 'Create new class',
        instructor: req.session.instructor,
        loggedIn: req.session.token ? true : false,
    });
});

module.exports = Router;
