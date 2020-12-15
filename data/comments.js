const collections = require('../config/mongoCollections');
const checkValidId = require('../helpers/check_valid_id');
const { ObjectId } = require('mongodb');
const checkUserInfo = require('../helpers/check_user_info');
const checkCommentInfo = require('../helpers/check_comment_info');

const create = async ({ userToken, parent_post, content }) => {
    const comments = await collections.comments();
    const users = await collections.users();
    const posts = await collections.posts();
    if (
        checkUserInfo.validateString(userToken) &&
        checkValidId(parent_post) &&
        checkUserInfo.validateString(parent_post) &&
        checkUserInfo.validateString(content)
    ) {
        const userLookup = await users.findOne({
            token: userToken,
        });
        if (!userLookup) {
            return {
                error: 'User not found.',
                statusCode: 404,
            };
        }
        const parentPostId = ObjectId(parent_post);
        const postLookup = await posts.findOne({ _id: parentPostId });
        if (!postLookup) {
            return {
                error: 'Post not found.',
                statusCode: 404,
            };
        }
        if (!userLookup.classes.includes(postLookup.class)) {
            return {
                error: 'User is not authorized for this comment.',
                statusCode: 401,
            };
        }
        const author = userLookup._id.toString();
        const votes = {};
        votes[userLookup._id.toString()] = 1;
        const insertCommentResult = await comments.insertOne({
            author,
            parent_post,
            time_submitted: String(new Date()),
            content,
            score: 1,
            votes,
        });
        const commentID = insertCommentResult.insertedId.toString();
        postLookup.comments.push(commentID);
        await posts.findOneAndUpdate(
            {
                _id: parentPostId,
            },
            {
                $set: {
                    comments: postLookup.comments,
                },
            }
        );
        userLookup.comments.push(commentID);
        await users.findOneAndUpdate(
            {
                email: userLookup.email,
            },
            {
                $set: {
                    comments: userLookup.comments,
                },
            }
        );

        return {
            statusCode: 201,
        };
    } else {
        return {
            error: 'Missing or invalid field(s) given',
            statusCode: 400,
        };
    }
};

const modifyComment = async ({ id, author, parent_post, content, endorse }) => {
    const comments = await collections.comments();
    const changedFields = checkCommentInfo({
        id,
        author,
        parent_post,
        content,
        endorse,
    });
    if (changedFields.error) {
        return {
            error: changedFields.error,
            statusCode: 400,
        };
    }
    id = ObjectId(id);
    const result = await comments.findOneAndUpdate(
        {
            _id: id,
        },
        { $set: changedFields }
    );
    if (result.ok !== 1) {
        return {
            error: 'Error updating fields in comments.',
            statusCode: 500,
        };
    } else {
        return {
            statusCode: 200,
        };
    }
};

const voteComment = async ({ commentId, userId, vote }) => {
    vote = Number(vote);
    if (
        !checkValidId(userId) ||
        !checkValidId(commentId) ||
        isNaN(vote) ||
        vote < 0 ||
        vote > 1
    ) {
        return {
            statusCode: 400,
            error: 'Invalid data provided.',
        };
    }
    const userCollection = await collections.users();
    const commentCollection = await collections.comments();
    const convertedUserId = ObjectId(userId);
    const convertedCommentId = ObjectId(commentId);
    const user = userCollection.findOne({
        _id: convertedUserId,
    });
    const comment = commentCollection.findOne({
        _id: convertedCommentId,
    });
    if (!user || !comment) {
        return {
            statusCode: 404,
            error: 'Could not find post or user from the given IDs.',
        };
    }
    if (!comment.votes) comment.votes = {};
    comment.votes[userId] = vote;
    comment.score = Object.values(comment.votes).reduce((a, b) => a + b, 0);
    const result = await commentCollection.findOneAndUpdate(
        {
            _id: convertedCommentId,
        },
        {
            $set: {
                votes: comment.votes,
                score: comment.score,
            },
        }
    );
    if (result.ok !== 1) {
        return {
            error: 'Error updating vote.',
            statusCode: 500,
        };
    } else {
        return {
            statusCode: 200,
        };
    }
};

const getPostComments = async (postID) => {
    const { getPostById } = require('./posts');
    const comments = await collections.comments();
    const postLookup = await getPostById(postID);
    if (postLookup.error) return postLookup;
    const commentsArr = postLookup.post.comments;
    let result;
    try {
        // eslint-disable-next-line no-undef
        result = await Promise.all(
            commentsArr.map((id) => comments.findOne({ _id: ObjectId(id) }))
        );
    } catch (e) {
        return {
            error: 'Internal server error.',
            statusCode: 500,
        };
    }
    const { getUserById } = require('./users');
    for (let i = 0; i < result.length; i++) {
        let author = await getUserById(result[i].author);
        if (author.error) return author;
        result[i].author =
            author.user.fullName.firstName +
            '  ' +
            author.user.fullName.lastName;
        let d = result[i].time_submitted;
        let new_date = d.slice(0, 21);
        result[i].time_submitted = new_date;
        result[i].score = result[i].score || 0;
    }

    return {
        comments: result,
        statusCode: 200,
    };
};

const getCommentById = async (commentID) => {
    if (!checkValidId(commentID)) {
        return {
            error: 'Invalid comment ID provided.',
            statusCode: 400,
        };
    }
    const convertedid = ObjectId(commentID);
    const posts = await collections.comments();
    const lookup = await posts.findOne({ _id: convertedid });
    if (!lookup) {
        return { error: 'No comment with given id', statusCode: 404 };
    } else {
        return {
            comment: lookup,
            statusCode: 200,
        };
    }
};

const deleteUserComments = async (id, userToDelete) => {
    const comments = await collections.comments();

    if (!checkValidId(id)) {
        return {
            error: 'Invalid comment ID provided for deletion',
            statusCode: 400,
        };
    }

    id = ObjectId(id).valueOf();

    const users = await collections.users();
    const deleteInfo = await comments.deleteOne({ _id: id });
    if (deleteInfo.deletedCount === 0) {
        return {
            error: 'Failed to delete post',
            statusCode: 404,
        };
    }
    users.updateOne(
        { _id: ObjectId(userToDelete).valueOf() },
        { $pull: { comments: id.toString() } }
    );
    return {
        statusCode: 204,
    };
};

const deletePostComments = async (id, postToDelete) => {
    //Assuming that the deletion of a post means the deletion of comments associated
    const comments = await collections.comments();

    if (!checkValidId(id)) {
        return {
            error: 'Invalid comment ID provided for deletion',
            statusCode: 400,
        };
    }

    id = ObjectId(id).valueOf();

    const posts = await collections.posts();
    const deleteInfo = await comments.deleteOne({ _id: id });
    if (deleteInfo.deletedCount === 0) {
        return {
            error: 'Failed to delete post',
            statusCode: 404,
        };
    }
    posts.updateOne(
        { _id: ObjectId(postToDelete).valueOf() },
        { $pull: { comments: id.toString() } }
    );
    return {
        statusCode: 204,
    };
};

module.exports = {
    deleteUserComments,
    deletePostComments,
    create,
    voteComment,
    modifyComment,
    getPostComments,
    getCommentById,
};
