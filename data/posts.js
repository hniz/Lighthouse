const collections = require('../config/mongoCollections');
const checkValidId = require('../helpers/check_valid_id');
const { ObjectId } = require('mongodb');
const comments = require('./comments');
const checkUserInfo = require('../helpers/check_user_info');
const checkUpdatedPostInfo = require('../helpers/check_post_info');
const { getClassById } = require('./classes');

const create = async ({ title, content, userToken, classID, tags }) => {
    const posts = await collections.posts();
    const users = await collections.users();
    const classes = await collections.classes();
    if (
        checkUserInfo.validateString(userToken) &&
        checkUserInfo.validateString(title) &&
        checkUserInfo.validateString(content) &&
        checkUserInfo.validateTagsArray(tags) &&
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
        const votes = {};
        votes[userLookup._id.toString()] = 1;
        const result = await posts.insertOne({
            title,
            author: userLookup._id.toString(),
            class: classLookup._id.toString(),
            time_submitted: String(new Date()),
            content,
            comments: [],
            tags,
            score: 1,
            votes,
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

const addTagToPost = async(tag, postID) => {
    const posts = await collections.posts();
    if(!checkValidId(postID)){
        return {
            error: 'Invalid post ID provided.',
            statusCode: 400,
        };
    }
    const convertedid = ObjectId(postID);
    const lookup = await posts.findOne({ _id: convertedid });
    if(!lookup){
        return { error: 'No post with given id', statusCode: 404};
    }
    const classID = lookup.class;
    const classLookup = await getClassById(classID);
    if(classLookup.error){
        return {
            error: classLookup.error,
            statusCode: classLookup.statusCode,
        };
    }
    const classTags = classLookup.class.tags;

    if(classTags.includes(tag)){
        if(!lookup.tags || lookup.tags.length === 0){
            lookup.tags = [tag];
        } else if(lookup.tags.includes(tag)){
            return {
                error: 'Tag already exists.',
                statusCode: 400,
            };
        } else {
            lookup.tags.push(tag);
        }
    } else {
        return {
            error: 'Tag does not exist within the class tags',
            statusCode: 400,
        };
    }
    

    const result = await posts.findOneAndUpdate(
        {
            _id: convertedid,
        },
        {
            $set: {
                tags: lookup.tags,
            },
        }
    );
    if(result.ok === 1){
        return {
            statusCode: 200,
        };
    } else{
        return {
            statusCode: 500,
        };
    }
};

const deleteTagFromPost = async(deleteTags, postID) => {
    const posts = await collections.posts();
    if(!checkValidId(postID)){
        return {
            error: 'Invalid post ID provided.',
            statusCode: 400,
        };
    }
    const convertedid = ObjectId(postID);
    const lookup = await posts.findOne({ _id: convertedid });
    if(!lookup){
        return { error: 'No post with given id', statusCode: 404};
    }

    let currPostTags = lookup.tags;
    let updatedPostTags = currPostTags.filter(x => deleteTags.indexOf(x) === -1);

    const result = await posts.findOneAndUpdate(
        {
            _id: convertedid,
        },
        {
            $set: {
                tags: updatedPostTags,
            },
        }
    );
    if(result.ok === 1){
        return {
            statusCode: 200,
        };
    } else{
        return {
            statusCode: 500,
        };
    }
};

const modifyPost = async ({ id, title, author, content, endorse }) => {
    const posts = await collections.posts();
    const changedFields = checkUpdatedPostInfo({
        id,
        title,
        author,
        content,
        endorse,
    });
    if (changedFields.error) {
        return {
            error: changedFields.error,
            statusCode: 400,
        };
    }
    let convertedid = ObjectId(id);
    const result = await posts.findOneAndUpdate(
        {
            _id: convertedid,
        },
        { $set: changedFields }
    );
    if (result.ok !== 1) {
        return {
            error: 'Error updating fields in posts.',
            statusCode: 500,
        };
    } else {
        return {
            statusCode: 200,
        };
    }
};

const votePost = async ({ userId, postId, vote }) => {
    vote = Number(vote);
    if (
        !checkValidId(userId) ||
        !checkValidId(postId) ||
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
    const postCollection = await collections.posts();
    const convertedUserId = ObjectId(userId);
    const convertedPostId = ObjectId(postId);
    const user = await userCollection.findOne({
        _id: convertedUserId,
    });
    const post = await postCollection.findOne({
        _id: convertedPostId,
    });
    if (!user || !post) {
        return {
            statusCode: 404,
            error: 'Could not find post or user from the given IDs.',
        };
    }
    post.votes[userId] = vote;
    post.score = Object.values(post.votes).reduce((a, b) => a + b, 0);
    const result = await postCollection.findOneAndUpdate(
        {
            _id: convertedPostId,
        },
        {
            $set: {
                votes: post.votes,
                score: post.score,
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
            score: post.score,
            statusCode: 200,
        };
    }
};

const getPostById = async (id) => {
    if (!checkValidId(id)) {
        return {
            error: 'Invalid post ID provided.',
            statusCode: 400,
        };
    }
    const convertedid = ObjectId(id);
    const posts = await collections.posts();
    const lookup = await posts.findOne({ _id: convertedid });
    if (!lookup) {
        return { error: 'No post with given id', statusCode: 404 };
    } else {
        return {
            post: lookup,
            statusCode: 200,
        };
    }
};

const deletePost = async (id) => {
    const posts = await collections.posts();

    if (!checkValidId(id)) {
        return {
            error: 'Invalid post ID provided for deletion',
            statusCode: 400,
        };
    }

    let convertedid = ObjectId(id);

    const postLookup = await posts.findOne({
        _id: convertedid,
    });

    if (!postLookup) {
        return {
            statusCode: 404,
            error: 'Could not find post or user from the given IDs.',
        };
    }

    let commentsArray = postLookup.comments;
    commentsArray.forEach((comment) => {
        comments.deletePostComments(comment, posts._id);
    });

    let author = postLookup.author;

    const users = await collections.users();
    const deleteInfo = await posts.deleteOne({ _id: convertedid });
    if (deleteInfo.deletedCount === 0) {
        return {
            error: 'Failed to delete post',
            statusCode: 404,
        };
    }
    users.updateOne(
        { _id: ObjectId(author) },
        { $pull: { posts: id } }
    );

    const classes = await collections.classes();
    const postClass = await classes.findOne({
        _id: ObjectId(classes.author),
    });

    if(!postClass){
        return{
            error: 'No class with the given ID',
            statusCode: 404,
        };
    }

    postClass.updateOne(
        {_id: ObjectId(classes.author)},
        { $pull: { posts: id} }
    );

    return {
        statusCode: 204,
    };
};

const getPostAuthor = async(id) => {
    if (!checkValidId(id)) {
        return {
            error: 'Invalid post ID provided.',
            statusCode: 400,
        };
    }
    const convertedid = ObjectId(id);
    const posts = await collections.posts();
    const lookup = await posts.findOne({ _id: convertedid });
    if (!lookup) {
        return { error: 'No post with given id', statusCode: 404 };
    }
    const users = await collections.users();
    let author = await users.findOne({ _id: ObjectId(lookup.author) });
    if(!author){
        return { error: 'Invalid author of post', statusCode: 404};
    } else {
        return{
            firstName: author.fullName.firstName,
            lastName: author.fullName.lastName,
            userId: author._id.toString(),
            statusCode: 200,
        };
    }
};


module.exports = {
    deletePost,
    create,
    modifyPost,
    getPostById,
    votePost,
    addTagToPost,
    deleteTagFromPost,
    getPostAuthor,
};
