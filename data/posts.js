const collections = require('../config/mongoCollections');
const checkValidId = require('../helpers/check_valid_id');
const { ObjectId } = require('mongodb');
const comments = require('./comments');
const checkUserInfo = require('../helpers/check_user_info');

const create = async({title, author, content}) => {
    const posts = await collections.posts();
    if(checkUserInfo.validateString(title) ||checkUserInfo.validateString(author) || checkUserInfo.validateString(content)){
        posts.insertOne({
            title,
            author,
            time_submitted: String(new Date()),
            content,
            comments: [],
            tags: [],
            score: 1,
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
        { $pull: { posts: id.toString() } },
    );
    return {
        statusCode: 204,
    };
};

module.exports = {
    deletePost,
    create,
};
