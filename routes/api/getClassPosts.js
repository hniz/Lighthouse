const e = require('express');
const classes = require('../../data/classes');
const Router = e.Router();

Router.get('/', async (req, res) => {
    const classId = req.query.id;
    try {
        const result = await classes.getClassById(classId);
        if (result.error) {
            res.status(result.statusCode).render('partials/class_not_found', {
                layout: null,
            });
        }
        const fetchedClass = result.class;
        if (fetchedClass.posts.length === 0) {
            res.render('partials/display_class_posts', {
                postsExist: false,
            });
            return;
        }
        const getClassPostsResult = await classes.getClassPosts(req.query.id);
        if (getClassPostsResult.error) {
            res.status(500).send(
                '<p> Sorry, there was an error fetching the class posts.</p>'
            );
            return;
        }
        let postData = [];
        getClassPostsResult.classPosts.forEach(({ post }) => {
            postData.push({
                title: post.title,
                ids: post._id.toString(),
            });
        });
        res.render('partials/display_class_posts', {
            postsExist: true,
            data: postData,
            classId: classId,
        });
    } catch (e) {
        res.status(500).send(
            '<p> Sorry, there was an error fetching the class posts.</p>'
        );
    }
});

module.exports = Router;
