const e = require('express');
const { getPostById, modifyPost } = require('../../data/posts');
const { getUserByToken } = require('../../data/users');
const nl2br = require('nl2br');
const { getClassById } = require('../../data/classes');
const Router = e.Router();

Router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const userLookup = await getUserByToken(req.session.token);
    const postLookup = await getPostById(id);
    if (userLookup.error) {
        res.status(postLookup.statusCode).render('error', {
            title: 'Error',
            error: userLookup.error,
            loggedIn: req.session.token ? true : false,
        });
    } else if (postLookup.error) {
        res.status(postLookup.statusCode).render('error', {
            title: 'Error',
            error: postLookup.error,
            loggedIn: req.session.token ? true : false,
        });
    } else if (postLookup.post.author !== userLookup.user._id.toString()) {
        res.status(401).render('error', {
            title: 'Error',
            error:
                'You are not the author of this post, and cannot edit this post.',
            loggedIn: req.session.token ? true : false,
        });
    } else {
        const classid = postLookup.post.class;
        const classLookup = getClassById(classid);
        if(classLookup.error){
            res.status(classLookup.statusCode).render('error', {
                title: 'Error',
                error: classLookup.error,
                loggedIn: req.session.token ? true : false,
            });
        }
        res.render('edit_post', {
            title: `Edit ${postLookup.post.title}`,
            post: postLookup.post,
            loggedIn: req.session.token ? true : false,
            class: classLookup.class,
        });
    }
});

Router.post('/', async (req, res) => {
    const id = req.body['post-id'];
    const userLookup = await getUserByToken(req.session.token);
    const postLookup = await getPostById(id);
    if (userLookup.error) {
        res.status(userLookup.statusCode).render('error', {
            title: 'Error',
            error: userLookup.error,
        });
    } else if (postLookup.error) {
        res.status(postLookup.statusCode).render('error', {
            title: 'Error',
            error: postLookup.error,
        });
    } else if (postLookup.post.author !== userLookup.user._id.toString()) {
        res.status(401).render('error', {
            title: 'Error',
            error: 'You are not authorized to edit this class.',
        });
    } else {
        const fields = {
            id: req.body['post-id'],
            title: req.body['post-title'],
            content: nl2br(req.body['post-content'], false),
        };
        const result = await modifyPost(fields);
        if (result.error) {
            res.status(result.statusCode).render('error', {
                title: 'Error',
                error: result.error,
            });
        } else {
            let postsUrl = req.baseUrl.slice(0, 5);
            res.redirect(`${postsUrl}/${fields.id}`);
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
