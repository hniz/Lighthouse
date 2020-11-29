const collections = require('../config/mongoCollections');
const checkUserInfo = require('../helpers/check_user_info');
const posts = require('./posts')
const comments = require('./comments')
const classes = require('./classes')
const bcrypt = require('bcrypt');

const create = async ({ email, firstName, lastName, password, type }) => {
    const users = await collections.users();
    if (checkUserInfo.checkUserInfo(email, password, firstName, lastName, type)) {
        const userLookup = await users.findOne({ email });
        if (!userLookup) {
            users.insertOne({
                email,
                fullName: {
                    firstName,
                    lastName,
                },
                type,
                posts: [],
                comments: [],
                classes: [],
                hashedPassword: await bcrypt.hash(password, 8),
            });
            return {
                statusCode: 201,
            };
        } else {
            return {
                error: 'User already exists.',
                statusCode: 400,
            };
        }
    } else {
        return {
            error: 'Missing one or more fields.',
            statusCode: 400,
        };
    }
};

const deleteUser = async({ email }) => {  //Notes: Should we get password confirmation to delete a user? 
    const users = await collections.users();
    const userLookup = await users.findOne({ email })

    if(!userLookup){ 
        return { 
            error: "Delete user failed: user does not exist.",
            statusCode: 400
        };
    } else { 
        if(!checkUserInfo.validateEmail(email)){ 
            return { 
                error: "Invalid email provided for deletion.",
                statusCode: 400
            }
        }
        //Need to delete the posts, comments and users collection as well.
        const postsArray = userLookup.posts;
        postsArray.forEach(member => { 
            posts.deletePost(member, userLookup._id) 
        })
        const commentsArray = userLookup.comments;
        commentsArray.forEach(member => { 
            comments.deleteComment(member)
        })
        const classesArray = userLookup.classes;
        classesArray.forEach(member => { 
            classes.deleteClasses(member)
        })
        const deleteInfo = await users.deleteOne({email: email})
        if(deleteInfo.deletedCount === 0){ 
            return { 
                error: "Failed to delete user.",
                statusCode: 404
            };
        }
        return { 
            statusCode: 204
        }
    }
}

module.exports = {
    create,
    deleteUser
};
