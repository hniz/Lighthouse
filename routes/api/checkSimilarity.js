const express = require('express');
const stringSimilarity = require('string-similarity');
const { getClassById, getClassPosts } = require('../../data/classes');
const Router = express.Router();
const { getUserByToken } = require('../../data/users');
const { validateString } = require('../../helpers/check_user_info');
const xss = require('xss');

Router.post('/:classId', async (req, res) => {
    const userLookup = await getUserByToken(req.session.token);
    if (userLookup.error) {
        return res
            .status(userLookup.statusCode)
            .json({ error: userLookup.error });
    }
    const classLookup = await getClassById(req.params.classId);
    if (classLookup.error) {
        return res
            .status(classLookup.statusCode)
            .json({ error: classLookup.error });
    }
    const user = userLookup.user;
    const course = classLookup.class;
    if (!user.classes.includes(course._id.toString())) {
        return res
            .status(401)
            .json({ error: 'You are not authorized post in this class!' });
    }
    const body = xss(req.body['post-description']);
    if (!validateString(body)) {
        return res.status(400).json({
            error: 'Missing or invalid "post-description" key in body',
        });
    }
    const classPosts = await getClassPosts(course._id.toString());
    if (classPosts.error) {
        return res.status(500).json({
            error: 'Internal server error.',
        });
    }
    const postBodies = classPosts.classPosts
        .filter((lookup) => {
            return !lookup.error;
        })
        .map(({ post }) => {
            return post && post.content;
        })
        .filter((content) => typeof content === 'string');
    if (postBodies.length > 0) {
        const similarities = stringSimilarity.findBestMatch(body, postBodies);
        if (similarities.bestMatch.rating > 0.5) {
            const similarPost =
                classPosts.classPosts[similarities.bestMatchIndex];
            return res.status(200).json({
                similar: similarPost.post,
                rating: similarities.bestMatch.rating,
            });
        }
    }
    return res.status(200).json({});
});

module.exports = Router;
