const e = require('express');
const { getUserById, getUserByToken } = require('../../data/users');
const { getClassById } = require('../../data/classes');
const Router = e.Router();
const nl2br = require('nl2br');

const displayProfile = async (req, res) => {
    const userId = req.params.id;
    const userLookup = await getUserById(userId);
    const userToken = await getUserByToken(req.session.token);

    if (userToken.error) {
        res.status(userToken.statusCode).render('profile', {
            title: 'Error',
            error: userToken.error,
            loggedIn: req.session.token ? true : false,
        });
    }

    if (userLookup.error) {
        res.status(userLookup.statusCode).render('profile', {
            title: 'Error',
            error: userLookup.error,
            loggedIn: req.session.token ? true : false,
        });
    } else {
        const usersClasses = userLookup.user.classes;
        let classes = [];
        for (let i = 0; i < usersClasses.length; i++) {
            const getClass = await getClassById(usersClasses[i]);
            classes.push(getClass.class.name);
        }
        const user = userLookup.user;
        user.fullName = user.fullName.firstName + ' ' + user.fullName.lastName;
        user.description = user.description
            ? nl2br(user.description, false)
            : '';
        res.status(userLookup.statusCode).render('profile', {
            title: `${user.fullName}'s Profile`,
            user,
            userClasses: classes,
            loggedIn: req.session.token ? true : false,
            editable: userToken.user._id.toString() === userId,
        });
    }
};

Router.use('/:id', displayProfile);

Router.use('/', async (req, res) => {
    const userLookup = await getUserByToken(req.session.token);
    if (userLookup.error) {
        return res.status(userLookup.statusCode).render('profile', {
            title: 'Error',
            error: userLookup.error,
            loggedIn: req.session.token ? true : false,
        });
    }
    const userId = userLookup.user._id.toString();
    res.redirect(`${req.originalUrl}/${userId}`);
});

module.exports = Router;
