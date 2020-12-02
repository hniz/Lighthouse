const express = require('express');
const app = express();
const staticFiles = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');
const { configAuth } = require('./auth');
const session = require('express-session');
const Handlebars = require('handlebars');

const handleBars = exphbs.create({
    defaultLayout: 'main',
    helpers: {
        asJSON: (obj, spacing) => {
            if (typeof spacing === 'number')
                return new Handlebars.SafeString(
                    JSON.stringify(obj, null, spacing),
                );

            return new Handlebars.SafeString(JSON.stringify(obj));
        },
    },
});

app.use('/public', staticFiles);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handleBars.engine);
app.set('view engine', 'handlebars');

app.use(
    session({
        name: 'AuthCookie',
        secret: 'the secret string!',
        resave: false,
        saveUninitialized: true,
    }),
);

configAuth(app);
configRoutes(app);

app.listen(3000, () => {
    console.log('server running on port 3000');
});
