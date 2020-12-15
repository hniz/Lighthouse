const e = require('express');
const { getClassById } = require('../../data/classes');
const { create } = require('../../data/posts');
const { getUserByToken } = require('../../data/users');
const Router = e.Router();

Router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const classLookup = await getClassById(id);
    const userLookup = await getUserByToken(req.session.token);
    if (userLookup.error || classLookup.error) {
        const statusCode = classLookup.error ? classLookup.statusCode : userLookup.statusCode;
        res.status(statusCode).render('new_post', {
            title: 'Error',
            error: classLookup.error || userLookup.error,
            loggedIn: req.session.token ? true : false,
        });
    } else {
        const classID = classLookup.class._id.toString();
        if (!userLookup.user.classes.includes(classID)) {
            res.status(401).render('new_post', {
                title: 'Error',
                error: 'You are not registered for this class!',
                loggedIn: req.session.token ? true : false,
            });
        } else {
            res.status(classLookup.statusCode).render('new_post', {
                title: `New Post for ${classLookup.class.name}`,
                class: classLookup.class,
                classID,
                loggedIn: req.session.token ? true : false,
            });
        }
    }
});

Router.post('/', async (req, res) => {
    const id = req.body['post-class'];
    const description = req.body['post-description'];
    const title = req.body['post-name'];
    const result = await create({
        title,
        content: description,
        userToken: req.session.token,
        classID: id,
    });
    if (result.error) {
        res.status(result.statusCode).render('new_post', {
            title: 'Error',
            error: result.error,
        });
    } else {
        res.redirect('/dashboard');
    }
});

module.exports = Router;
