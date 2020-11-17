const routeConstructor = (app) => {
    app.get('/', (req, res) => {
        res.render('home_page', { title: 'Lighthouse' });
    });
    app.use('*', (req, res) => {
        res.status(404).render('not_found', { title: 'Page not found!' });
    });
};

module.exports = routeConstructor;
