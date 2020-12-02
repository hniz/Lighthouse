const e = require('express');
const Router = e.Router();

Router.get('/', (req, res) => {
    req.session.destroy();
    res.render('logout', { title: 'Logged out' });
});

module.exports = Router;
