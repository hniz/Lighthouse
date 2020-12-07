const collections = require('../config/mongoCollections');
const checkValidId = require('../helpers/check_valid_id');
const { ObjectId, ObjectID } = require('mongodb');
const posts = require('./posts');
const checkUserInfo = require('../helpers/check_user_info');
const checkClassInfo = require('../helpers/check_class_info');

const create = async ({ name, description, instructorToken }) => {
    const classes = await collections.classes();
    const users = await collections.users();
    if (
        !checkUserInfo.validateString(name) ||
        !checkUserInfo.validateString(description) ||
        !checkUserInfo.validateString(instructorToken)
    ) {
        return {
            error: 'Missing or invalid field(s) given.',
            statusCode: 400,
        };
    } else {
        const instructorLookup = await users.findOne({
            token: instructorToken,
        });
        const classLookup = await classes.findOne({ name }); //Need name to be the unique identifier
        if (!instructorLookup || instructorLookup.type !== 'instructor') {
            if (!instructorLookup)
                return {
                    error: 'User not found.',
                    statusCode: 404,
                };
            else
                return {
                    error: 'User is not authorized to create a course.',
                    statusCode: 401,
                };
        }
        if (!classLookup) {
            let code = `${name}-${Math.floor(Math.random() * 10000)}`;
            while (await classes.findOne({ code })) {
                code = `${name}-${Math.floor(Math.random() * 10000)}`;
            }
            const password = `${Math.floor(Math.random() * 10000000)}`;
            const course = await classes.insertOne({
                name,
                description,
                posts: [],
                students: [],
                tags: [],
                instructor: instructorLookup._id.toString(),
                code,
                password,
            });
            const classID = course.insertedId.toString();
            instructorLookup.classes.push(classID);
            await users.findOneAndUpdate(
                {
                    email: instructorLookup.email,
                },
                {
                    $set: {
                        classes: instructorLookup.classes,
                    },
                }
            );
            return {
                statusCode: 201,
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
    const convertedid = ObjectId(id);
    const classes = await collections.classes();
    const lookup = await classes.findOne({ _id: convertedid });
    if (!lookup) {
        return { error: 'No class with given id', statusCode: 404 };
    } else {
        return {
            class: lookup,
            statusCode: 200,
        };
    }
};

const modifyClass = async ({
    id,
    name,
    description,
    students,
    tags,
    instructor,
    code,
    password,
}) => {
    const classes = await collections.classes();
    if (!checkValidId(id)) {
        return {
            error: 'Invalid class ID provided.',
            statusCode: 400,
        };
    }
    const convertedid = ObjectId(id);
    const lookup = await classes.findOne({ _id: convertedid });
    if (!lookup) {
        return { error: 'No class with given id', statusCode: 404 };
    }
    const uniqueClassLookup = await classes.findOne({ code });
    if (code && uniqueClassLookup) {
        return {
            error: 'Class code is not unique.',
            statusCode: 400,
        };
    }
    const changedFields = checkClassInfo({
        name,
        description,
        students,
        tags,
        instructor,
        code,
        password,
    });
    if (changedFields.errors) {
        return {
            error: changedFields.errors,
            statusCode: 400,
        };
    }
    const result = await classes.findOneAndUpdate(
        {
            name,
        },
        { $set: changedFields }
    );
    if (result.ok !== 1) {
        return {
            error: 'Error updating fields in class',
            statusCode: 500,
        };
    } else {
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
