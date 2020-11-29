const collections = require('../config/mongoCollections');
const checkValidId = require('./helpers/check_valid_id');
const { ObjectId } = require('mongodb');

const deleteUserComments = async(id, userToDelete) => {
    const comments = await collections.comments();
    
    if(!checkValidId(id)){ 
        return {
            error: "Invalid post ID provided for deletion",
            statusCode: 400
        }
    }

    id = ObjectId(id).valueOf();

    const users = await collections.users();
    const deleteInfo = await comments.deleteOne({_id:id})
    if(deleteInfo.deletedCount === 0){ 
        return { 
            error: "Failed to delete post",
            statusCode: 404
        }
    }
    users.updateOne({_id: ObjectId(userToDelete).valueOf()}, {$pull: {"comments": id.toString()}})
    return { 
        statusCode: 204
    }
}

const deletePostComments = async(id, postToDelete) => {
    //Assuming that the deletion of a post means the deletion of comments associated
    const comments = await collections.comments();
    
    if(!checkValidId(id)){ 
        return {
            error: "Invalid post ID provided for deletion",
            statusCode: 400
        }
    }

    id = ObjectId(id).valueOf();

    const posts = await collections.posts();
    const deleteInfo = await comments.deleteOne({_id:id})
    if(deleteInfo.deletedCount === 0){ 
        return { 
            error: "Failed to delete post",
            statusCode: 404
        }
    }
    posts.updateOne({_id: ObjectId(postToDelete).valueOf()}, {$pull: {"comments": id.toString()}})
    return { 
        statusCode: 204
    }
}

module.exports = {
   deleteUserComments,
   deletePostComments
}