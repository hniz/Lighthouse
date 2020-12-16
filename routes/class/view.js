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
        return res.status(classLookup.statusCode).render('class', {
            title: 'Error',
            error: classLookup.error,
        });
    }
    const user = userLookup.user;
    const course = classLookup.class;
    if (!user.classes.includes(course._id.toString())) {
        return res.status(401).render('class', {
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

    const filteredPosts = getClassPostsResult.classPosts.filter(
        ({ post }) => !!post
    );
    let postData = [];
    for (const { post } of filteredPosts) {
        let { comments } = await getPostComments(post._id.toString());
        comments = comments.map((comment) => {
            comment.upvoted =
                comment.votes &&
                comment.votes[userLookup.user._id.toString()] === 1;
            return comment;
        });
        postData.push({
            title: post.title,
            endorse: post.endorse,
            body: post.content,
            ids: post._id.toString(),
            score: post.score,
            upvoted:
                post.votes && post.votes[userLookup.user._id.toString()] === 1,
            comments,
        });
    }
    return res.render('class', {
        title: course.name,
        courseName: course.name,
        courseDesc: course.description,
        tags: course.tags,
        postsExist: postData.length > 0,
        data: postData,
        instructor: course.instructor === user._id.toString(),
        loggedIn: req.session.token ? true : false,
        classId: course._id.toString(),
    });
});

module.exports = Router;
