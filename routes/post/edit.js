const e = require('express');
const {
    getPostById,
    modifyPost,
} = require('../../data/posts');
const { getUserByToken } = require('../../data/users');
const Router = e.Router();

Router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const userLookup = await getUserByToken(req.session.token);
    const postLookup = await getPostById(id);
    if (userLookup.error) {
        res.status(postLookup.statusCode).render('error', {
            title: 'Error',
            error: userLookup.error,
        });
    } else if (postLookup.error) {
        res.status(postLookup.statusCode).render('error', {
            title: 'Error',
            error: postLookup.error,
        });
    } else if (
        postLookup.post.author !== userLookup.user._id.toString()
    ) {
        res.status(401).render('error', {
            title: 'Error',
            error: 'You are not the author of this post, and cannot edit this post.',
        });
    } else {
        res.render('edit_post', {
            title: `Edit ${postLookup.post.title}`,
            post: postLookup.post,
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
    } else if (
        postLookup.post.author !== userLookup.user._id.toString()
    ) {
        res.status(401).render('error', {
            title: 'Error',
            error: 'You are not authorized to edit this class.',
        });
    } else {
        const fields = {
            id: req.body['post-id'],
            title: req.body['post-title'],
            content: req.body['post-content'],
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

module.exports = Router;