const e = require('express');
const { getPostById, modifyPost, addTagToPost } = require('../../data/posts');
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
        const classLookup = await getClassById(classid);
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
    const tags = req.body['post-tag'];
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
            const classLookup = await getClassById(postLookup.post.class);
            if(classLookup.error){
                const statusCode = classLookup.error;
                res.status(statusCode).render('error', {
                    title: 'Error',
                    error: classLookup.error,
                });
            }

            const classTags = classLookup.class.tags;
            let postTags = [];
            console.log(tags);
        
            if(!tags.includes('No tag selected')){
                classTags.forEach((tag) => {
                    if(tags.includes(tag)){
                        postTags.push(tag);
                    }
                });
            }
            console.log(postTags);

            for(let i = 0; i<postTags.length; i++){
                let result = await addTagToPost(postTags[i], id);
                console.log('this is the result: ');
                console.log(result);
                if(result.error !== undefined){
                    res.status(result.statusCode).render('error', {
                        title: 'Error',
                        error: result.error,
                    });
                }
            }
            console.log('out of the for loop');
            let postsUrl = req.baseUrl.slice(0, 5);
            res.redirect(`${postsUrl}/${fields.id}`);
        }
    }
});

// Router.post('/tags', async (req, res) => {
//     const id = req.body['post-id'];
//     const tags = req.body['post-tag'];
//     const userLookup = await getUserByToken(req.session.token);
//     const postLookup = await getPostById(id);

//     if (userLookup.error) {
//         res.status(userLookup.statusCode).render('error', {
//             title: 'Error',
//             error: userLookup.error,
//         });
//     } else if (postLookup.error) {
//         res.status(postLookup.statusCode).render('error', {
//             title: 'Error',
//             error: postLookup.error,
//         });
//     } else if (
//         postLookup.post.author !== userLookup.user._id.toString()
//     ) {
//         res.status(401).render('error', {
//             title: 'Error',
//             error: 'You are not authorized to edit this post.',
//         });
//     } else {
//         const classLookup = await getClassById(postLookup.post.class);
//         if(classLookup.error){
//             const statusCode = classLookup.error;
//             res.status(statusCode).render('error', {
//                 title: 'Error',
//                 error: classLookup.error,
//             });
//         }

//         console.log(classLookup.class);
    
//         const classTags = classLookup.class.tags;
//         let postTags = [];
    
//         if(!tags.includes('No tag selected')){
//             classTags.forEach((tag) => {
//                 if(tags.includes(tag)){
//                     postTags.push(tag);
//                 }
//             });
//         }

//         for(let i = 0; i<postTags.length; i++){
//             let result = await addTagToPost(postTags[i], id);
//             if(result.error){
//                 res.status(result.statusCode).render('error', {
//                     title: 'Error',
//                     error: result.error,
//                 });
//             }
//         }
//         let postsUrl = req.baseUrl.slice(0, 5);
//         res.redirect(`${postsUrl}/${id}`);
//     }
// });

module.exports = Router;
