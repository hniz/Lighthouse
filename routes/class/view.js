const express = require('express');
const { getClassById, getClassPosts } = require('../../data/classes');
const { getPostComments } = require('../../data/comments');
const { getUserByToken } = require('../../data/users');
const Router = express.Router();
const nl2br = require('nl2br');

Router.get('/:id', async (req, res) => {
    const userLookup = await getUserByToken(req.session.token);
    if (userLookup.error) {
        return res.status(userLookup.statusCode).render('class', {
            title: 'Error',
            error: userLookup.error,
            loggedIn: req.session.token ? true : false,
        });
    }
    const classLookup = await getClassById(req.params.id);
    if (classLookup.error) {
        return res.status(classLookup.statusCode).render('class', {
            title: 'Error',
            error: classLookup.error,
            loggedIn: req.session.token ? true : false,
        });
    }
    const user = userLookup.user;
    const course = classLookup.class;
    if (!user.classes.includes(course._id.toString())) {
        return res.status(401).render('class', {
            title: 'Error',
            error: 'You are not registered for this class!',
            loggedIn: req.session.token ? true : false,
        });
    }
    const getClassPostsResult = await getClassPosts(req.params.id);
    if (getClassPostsResult.error) {
        return res.status(500).render('class', {
            title: 'Error',
            error: 'There was an error fetching the class posts.',
            loggedIn: req.session.token ? true : false,
        });
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
            body: nl2br(post.content, false),
            tags: post.tags,
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
        courseDesc: course.description ? nl2br(course.description, false) : '',
        tags: course.tags ? course.tags : undefined,
        postsExist: postData.length > 0,
        data: postData,
        instructor: course.instructor === user._id.toString(),
        loggedIn: req.session.token ? true : false,
        classId: course._id.toString(),
    });
});

module.exports = Router;
