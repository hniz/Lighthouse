const express = require('express');
const { getClassById, getClassPosts } = require('../../data/classes');
const { getPostComments } = require('../../data/comments');
const { getUserByToken } = require('../../data/users');
const Router = express.Router();

Router.get('/:id', async (req, res) => {
    const userLookup = await getUserByToken(req.session.token);
    if (userLookup.error) {
        return res.status(userLookup.statusCode).render('class', {
            title: 'Error',
            error: userLookup.error,
        });
    }
    const classLookup = await getClassById(req.params.id);
    if (classLookup.error) {
        res.status(classLookup.statusCode).render('class', {
            title: 'Error',
            error: classLookup.error,
        });
    }
    const user = userLookup.user;
    const course = classLookup.class;
    if (!user.classes.includes(course._id.toString())) {
        res.status(401).render('class', {
            title: 'Error',
            error: 'You are not registered for this class!',
        });
    }
    const getClassPostsResult = await getClassPosts(req.params.id);
    if (getClassPostsResult.error) {
        res.status(500).send(
            '<p> Sorry, there was an error fetching the class posts.</p>'
        );
        return;
    }

    let postData = [];
    for (const { post } of getClassPostsResult.classPosts) {
        const { comments } = await getPostComments(post._id.toString());
        postData.push({
            title: post.title,
            ids: post._id.toString(),
            comments,
        });
    }
    return res.render('class', {
        title: course.name,
        courseName: course.name,
        tags: course.tags,
        postsExist: postData.length > 0,
        data: postData,
    });
});

module.exports = Router;
