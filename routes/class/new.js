const e = require('express');
const Router = e.Router();

Router.get('/', (req, res) => {
    res.status(req.session.instructor ? 200 : 401).render('new_class', {
        title: 'Create new class',
        instructor: req.session.instructor,
    });
});

module.exports = Router;
