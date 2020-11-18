const loginRoute = require('./login');
const apiRoutes = require('./api');

const routeConstructor = (app) => {
    app.use('/api', apiRoutes);
    app.use('/login', loginRoute);
    app.get('/', (req, res) => {
        res.render('home_page', { title: 'Lighthouse' });
    });
    app.use('*', (req, res) => {
        res.status(404).render('not_found', { title: 'Page not found!' });
    });
};

module.exports = routeConstructor;
