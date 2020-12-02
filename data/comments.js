const collections = require('../config/mongoCollections');
const checkValidId = require('../helpers/check_valid_id');
const { ObjectId } = require('mongodb');
const checkUserInfo = require('../helpers/check_user_info');


const create = async({author, parent_post, content}) => { 
    const comments = await collections.comments;
    if(checkUserInfo.validateString(author) || checkUserInfo.validateString(parent_post) || checkUserInfo.validateString(content)){ 
        comments.insertOne({
            author,
            parent_post,
            time_submitted: String(new Date()),
            content,
        });
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
        { $pull: { comments: id.toString() } },
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
        { $pull: { comments: id.toString() } },
    );
    return {
        statusCode: 204,
    };
};

module.exports = {
    deleteUserComments,
    deletePostComments,
    create,
};
