const collections = require('../config/mongoCollections');
const checkValidId = require('../helpers/check_valid_id');
const { ObjectId } = require('mongodb');
const checkUserInfo = require('../helpers/check_user_info');
const { checkCommentInfo } = require('../helpers/check_comment_info');

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
        const insertCommentResult = await comments.insertOne({
            author,
            parent_post,
            time_submitted: String(new Date()),
            content,
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

const modifyComment = async ({ id, author, parent_post, content }) => {
    const comments = await collections.comments;
    const changedFields = checkCommentInfo({
        id,
        author,
        parent_post,
        content,
    });
    if (changedFields.error) {
        return {
            error: changedFields.errors,
            statusCode: 400,
        };
    }
    id = ObjectId(id).valueOf();
    const result = await comments.findOneAndUpdate(
        {
            id,
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
    return {
        comments: result,
        statusCode: 200,
    };
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
    modifyComment,
    getPostComments,
};
