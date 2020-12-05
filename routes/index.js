const loginRoute = require('./login');
const registerRoute = require('./register');
const logoutRoute = require('./logout');
const dashboardRoute = require('./dashboard');
const classRoute = require('./class');
const profileRoute = require('./user');

const routeConstructor = (app) => {
    app.use('/login', loginRoute);
    app.use('/register', registerRoute);
    app.use('/logout', logoutRoute);
    app.use('/dashboard', dashboardRoute);
    app.use('/class', classRoute);
    app.use('/user', profileRoute);
    app.get('/', (req, res) => {
        res.render('home_page', { title: 'Lighthouse' });
    });
    app.use('*', (req, res) => {
        res.status(404).render('not_found', { title: 'Page not found!' });
    });
};

module.exports = routeConstructor;
