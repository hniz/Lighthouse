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
<<<<<<< HEAD
            res.send('<p> No posts for this class found.</p>'); //maybe an error message here of no posts available
=======
            res.send('<p> No posts for this class found.</p>');
            return;
>>>>>>> 11236a1fce403c7a1dccffc3d1c142b8cd176798
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
            data: postData,
        });
    } catch (e) {
        res.status(500).send(
            '<p> Sorry, there was an error fetching the class posts.</p>'
        );
    }
});

module.exports = Router;