const e = require('express');
const {
    getClassById,
    modifyClass,
    addTagToClass,
} = require('../../data/classes');
const { getUserByToken } = require('../../data/users');
const nl2br = require('nl2br');
const Router = e.Router();

Router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const userLookup = await getUserByToken(req.session.token);
    const classLookup = await getClassById(id);
    if (userLookup.error) {
        res.status(userLookup.statusCode).render('error', {
            title: 'Error',
            error: userLookup.error,
            loggedIn: req.session.token ? true : false,
        });
    } else if (classLookup.error) {
        res.status(classLookup.statusCode).render('error', {
            title: 'Error',
            error: classLookup.error,
            loggedIn: req.session.token ? true : false,
        });
    } else if (
        classLookup.class.instructor !== userLookup.user._id.toString()
    ) {
        res.status(401).render('error', {
            title: 'Error',
            error: 'You are not authorized to edit this class.',
            loggedIn: req.session.token ? true : false,
        });
    } else {
        res.render('edit_class', {
            title: `Edit ${classLookup.class.name}`,
            class: classLookup.class,
            loggedIn: req.session.token ? true : false,
        });
    }
});

Router.post('/', async (req, res) => {
    const id = req.body['class-id'];
    const userLookup = await getUserByToken(req.session.token);
    const classLookup = await getClassById(id);
    if (userLookup.error) {
        res.status(userLookup.statusCode).render('error', {
            title: 'Error',
            error: userLookup.error,
        });
    } else if (classLookup.error) {
        res.status(classLookup.statusCode).render('error', {
            title: 'Error',
            error: classLookup.error,
        });
    } else if (
        classLookup.class.instructor !== userLookup.user._id.toString()
    ) {
        res.status(401).render('error', {
            title: 'Error',
            error: 'You are not authorized to edit this class.',
        });
    } else {
        const fields = {
            name: req.body['class-name'],
            description: nl2br(req.body['class-description'], false),
            code: req.body['class-code'],
            password: req.body['class-password'],
            id: req.body['class-id'],
        };
        const result = await modifyClass(fields);
        if (result.error) {
            res.status(result.statusCode).render('error', {
                title: 'Error',
                error: result.error,
            });
        } else {
            res.redirect(`${req.baseUrl}/${fields.id}`);
        }
    }
});

Router.post('/tags', async (req, res) => {
    const tag = req.body['tag-name'];
    const id = req.body['class-id'];
    const userLookup = await getUserByToken(req.session.token);
    const classLookup = await getClassById(id);
    if (userLookup.error) {
        res.status(userLookup.statusCode).render('error', {
            title: 'Error',
            error: userLookup.error,
        });
    } else if (classLookup.error) {
        res.status(classLookup.statusCode).render('error', {
            title: 'Error',
            error: classLookup.error,
        });
    } else if (
        classLookup.class.instructor !== userLookup.user._id.toString()
    ) {
        res.status(401).render('error', {
            title: 'Error',
            error: 'You are not authorized to edit this class.',
        });
    } else {
        const result = await addTagToClass({ tag, classID: id });
        if (result.error) {
            res.status(result.statusCode).render('error', {
                title: 'Error',
                error: result.error,
            });
        } else {
            res.redirect(`${req.baseUrl}/${id}`);
        }
    }
});

module.exports = Router;
