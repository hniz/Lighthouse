const e = require('express');
const classes = require('../../data/classes');
const { getUserByToken } = require('../../data/users');
const { getPostComments } = require('../../data/comments');
const Router = e.Router();
const nl2br = require('nl2br');

Router.get('/', async (req, res) => {
    const userLookup = await getUserByToken(req.session.token);
    const classId = req.query.id;
    const tag = req.query.tag && decodeURI(req.query.tag);
    try {
        const result = await classes.getClassById(classId);
        if (result.error || !userLookup.user.classes.includes(classId)) {
            res.status(result.statusCode).render('partials/class_not_found', {
                layout: null,
            });
        }

        const fetchedClass = result.class;
        if (fetchedClass.posts.length === 0) {
            res.render('partials/display_class_posts', {
                postsExist: false,
                layout: null,
                classId: fetchedClass._id.toString(),
            });
            return;
        }
        if (tag && !fetchedClass.tags.includes(tag)) {
            res.status(500).send('<p> Sorry, the tag is invalid.</p>');
            return;
        }
        const getClassPostsResult = await classes.getClassPosts(req.query.id);
        if (getClassPostsResult.error) {
            res.status(500).send(
                '<p> Sorry, there was an error fetching the class posts.</p>'
            );
            return;
        }
        const filteredPosts = getClassPostsResult.classPosts.filter(
            ({ post }) => (!!post && (tag ? post.tags.includes(tag) : true))
        );
            
        let postData = [];
        for (const { post } of filteredPosts) {
            let { comments } = await getPostComments(post._id.toString());
            if(comments !== null){
                comments = comments.map((comment)=>{
                    if(comment !== null){
                        comment.upvoted = comment.votes && comment.votes[userLookup.user._id.toString()] === 1;
                        return comment;
                    }
               });
                postData.push({
                    title: post.title,
                    body: nl2br(post.content, false),
                    endorse: post.endorse,
                    score: post.score,
                    ids: post._id.toString(),
                    upvoted: post.votes && post.votes[userLookup.user._id.toString()] === 1,
                    comments,
                });
            }
        }
        res.render('partials/display_class_posts', {
            postsExist: true,
            filteredPostsExist: filteredPosts.length > 0,
            data: postData,
            tags: fetchedClass.tags,
            classId: classId,
            layout: null,
            instructor:
                result.class.instructor === userLookup.user._id.toString(),
        });
    } catch (e) {
        console.log(e);
        res.status(500).send(
            '<p> Sorry, there was an error fetching the class posts. Please try again.</p>'
        );
    }
});

module.exports = Router;
