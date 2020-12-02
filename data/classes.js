const collections = require('../config/mongoCollections');
const checkValidId = require('../helpers/check_valid_id');
const { ObjectId, ObjectID } = require('mongodb');
const posts = require('./posts');
const checkUserInfo = require('../helpers/check_user_info');
const { checkClassInfo } = require('../helpers/check_class_info');

const create = async({name, description, instructor}) => {
    const classes = await collections.classes;
    if(!checkUserInfo.validateString(name) || !checkUserInfo.validateString(description) || !checkUserInfo.validateString(instructor)){
        return {
            error: 'Missing or invalid field(s) given.',
            statusCode: 400,
        };
    } else {
        const classLookup = await classes.findOne({ name }); //Need name to be the unique identifier
        if(!classLookup){
            classes.insertOne({
                name,
                description,
                posts: [],
                students: [],
                tags: [],
                instructor,
            });
            return {
                statusCode : 201,
            };
        } else {
            return {
                error: 'Class already exists',
                statusCode: 400,
            };
        }
    }
};


const getClassById = async (id) => {
    if (!checkValidId(id)) {
        return {
            error: 'Invalid class ID provided.',
            statusCode: 400,
        };
    }
    id = ObjectId(id).valueOf();
    const users = await collections.users();
    const lookup = await users.findOne({ _id: id });
    if (!lookup) {
        return { error: 'No class with given id', statusCode: 404 };
    } else {
        return {
            user: lookup,
            statusCode: 200,
        };
    }
};

const modifyClass = async({name, description, students, tags, instructor}) => {
    const classes = await collections.classes;
    const changedFields = checkClassInfo({name, description, students, tags, instructor});
    if(changedFields.errors){
        return {
            error: changedFields.errors,
            statusCode: 400,
        };
    }
    const result = await classes.findOneAndUpdate(
        {
            name,
        },
        { $set: changedFields}
    );
    if(result.ok !== 1){
        return {
            error: 'Error updating fields in class',
            statusCode: 500,
        };
    } else{
        return {
            statusCode: 200,
        };
    }
};

const deleteClassesFromUser = async (id, userToDelete) => {
    if (!checkValidId(id)) {
        return {
            error: 'Invalid class ID provided.',
            statusCode: 400,
        };
    }

    id = ObjectId(id).valueOf();
    const users = await collections.users();
    users.updateOne(
        { _id: ObjectId(userToDelete).valueOf() },
        { $pull: { classes: id.toString() } }
    );
    const classes = await collections.classes();
    classes.updateOne({ _id: id }, { $pull: { students: userToDelete } }); //student no longer enrolled in class
    return {
        statusCode: 204,
    };
};

const deleteClass = async (id) => {
    if (!checkValidId(id)) {
        return {
            error: 'Invalid class ID provided',
            statusCode: 400,
        };
    }

    id = Object(id).valueOf();
    const users = await collections.users();
    const classes = await collections.classes();
    const postsArray = classes.posts;

    postsArray.forEach((post) => {
        //get rid of all posts for that class
        posts.deletePost(post);
    });

    const studentArray = classes.students; //get rid of the class we are going to delete from all students
    studentArray.forEach((student) => {
        users.updateOne(
            { _id: ObjectId(student).valueOf() },
            { $pull: { classes: id.toString() } }
        );
    });
    users.updateOne(
        { _id: ObjectID(classes.instructor).valueOf() },
        { $pull: { classes: id.toString() } }
    ); //update for instructors

    const deleteInfo = await classes.deleteOne({ _id: id });
    if (deleteInfo.deletedCount === 0) {
        return {
            error: 'Failed to delete class',
            statusCode: 404,
        };
    }
    return {
        statusCode: 204,
    };
};

module.exports = {
    getClassById,
    deleteClassesFromUser,
    deleteClass,
    create,
    modifyClass,
};
