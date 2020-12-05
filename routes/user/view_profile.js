const e = require('express');
const { getUserById } = require('../../data/users');
const Router = e.Router();

Router.use('/:id', async (req, res) => {
    const userId = req.params.id;
    const userLookup = await getUserById(userId);
    if (userLookup.error) {
        res.status(userLookup.statusCode).render('profile', {
            title: 'Error',
            error: userLookup.error,
        });
    } else {
        const user = userLookup.user;
        user.fullName = user.fullName.firstName + ' ' + user.fullName.lastName;
        res.status(userLookup.statusCode).render('profile', {
            title: `${userLookup.fullName}'s Profile`,
            user,
        });
    }
});

module.exports = Router;
