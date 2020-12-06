const collections = require('../config/mongoCollections');
const checkValidId = require('../helpers/check_valid_id');
const { ObjectId } = require('mongodb');
const comments = require('./comments');
const checkUserInfo = require('../helpers/check_user_info');
const { checkPostInfo } = require('../helpers/check_post_info');

const create = async ({ title, content, userToken, classID }) => {
    const posts = await collections.posts();
    const users = await collections.users();
    const classes = await collections.classes();
    if (
        checkUserInfo.validateString(userToken) &&
        checkUserInfo.validateString(title) &&
        checkUserInfo.validateString(content) &&
        checkValidId(classID)
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
        const classLookup = await classes.findOne({ _id: ObjectId(classID) });
        if (!classLookup) {
            return {
                error: 'Class not found.',
                statusCode: 404,
            };
        }
        if (!userLookup.classes.includes(classLookup._id.toString())) {
            return {
                error: 'You are not registered for this class!',
                statusCode: 401,
            };
        }
        const result = await posts.insertOne({
            title,
            author: userLookup._id.toString(),
            class: classLookup._id.toString(),
            time_submitted: String(new Date()),
            content,
            comments: [],
            tags: [],
            score: 1,
        });
        const postID = result.insertedId.toString();

        userLookup.posts.push(postID);
        await users.findOneAndUpdate(
            {
                email: userLookup.email,
            },
            {
                $set: {
                    posts: userLookup.posts,
                },
            }
        );

        classLookup.posts.push(postID);
        await classes.findOneAndUpdate(
            {
                _id: ObjectId(classID),
            },
            {
                $set: {
                    posts: classLookup.posts,
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

const modifyPost = async ({ id, title, author, content }) => {
    const posts = await collections.posts;
    const changedFields = checkPostInfo({ id, title, author, content });
    if (changedFields.error) {
        return {
            error: changedFields.errors,
            statusCode: 400,
        };
    }
    id = ObjectId(id).valueOf();
    const result = await posts.findOneAndUpdate(
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

const getPostById = async(id) => {
    if (!checkValidId(id)) {
        return {
            error: 'Invalid class ID provided.',
            statusCode: 400,
        };
    }
    
    const convertedid = ObjectId(id);
    const posts = await collections.posts();
    const lookup = await posts.findOne({ _id: convertedid});
    if(!lookup){
        return { error: 'No post with given id', statusCode: 404 };
    } else {
        return {
            post: lookup,
            statusCode: 200,
        };
    }
};

const deletePost = async (id, userToDelete) => {
    //Assuming that the deletion of a post means the deletion of comments associated
    const posts = await collections.posts();

    if (!checkValidId(id)) {
        return {
            error: 'Invalid post ID provided for deletion',
            statusCode: 400,
        };
    }

    id = ObjectId(id).valueOf();
    const commentsArray = posts.comments;
    commentsArray.forEach((comment) => {
        comments.deletePostComments(comment, posts._id);
    });

    const users = await collections.users();
    const deleteInfo = await posts.deleteOne({ _id: id });
    if (deleteInfo.deletedCount === 0) {
        return {
            error: 'Failed to delete post',
            statusCode: 404,
        };
    }
    users.updateOne(
        { _id: ObjectId(userToDelete).valueOf() },
        { $pull: { posts: id.toString() } }
    );
    return {
        statusCode: 204,
    };
};

module.exports = {
    deletePost,
    create,
    modifyPost,
    getPostById,
};
