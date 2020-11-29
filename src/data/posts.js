const collections = require('../config/mongoCollections');
const checkValidId = require('./helpers/check_valid_id');
const { ObjectId } = require('mongodb');
const comments = require('./comments')

const deletePost = async(id, userToDelete) => {
    //Assuming that the deletion of a post means the deletion of comments associated
    const posts = await collections.posts();
    
    if(!checkValidId(id)){ 
        return {
            error: "Invalid post ID provided for deletion",
            statusCode: 400
        }
    }

    id = ObjectId(id).valueOf();
    const commentsArray = posts.comments;
    commentsArray.forEach(comment => { 
        comments.deleteComment(comment)
    });

    const posts = await collections.posts();
    const users = await collections.users();
    const deleteInfo = await posts.deleteOne({_id:id})
    if(deleteInfo.deletedCount === 0){ 
        return { 
            error: "Failed to delete post",
            statusCode: 404
        }
    }
    users.updateOne({_id: ObjectId(userToDelete).valueOf()}, {$pull: {"posts": id.toString()}})
    return { 
        statusCode: 204
    }
}

module.exports = {
    deletePost
};