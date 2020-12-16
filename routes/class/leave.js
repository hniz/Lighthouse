const { getClassById, removeStudentFromClass } = require('../../data/classes');
const { getUserByToken } = require('../../data/users');

const Router = require('express').Router();

Router.get('/:classId', async (req, res) => {
    const userLookup = await getUserByToken(req.session.token);
    if (userLookup.error) {
        return res.status(userLookup.statusCode).render('leave_class', {
            title: 'Error',
            error: userLookup.error,
        });
    }
    const classLookup = await getClassById(req.params.classId);
    if (classLookup.error) {
        return res.status(classLookup.statusCode).render('leave_class', {
            title: 'Error',
            error: classLookup.error,
        });
    }
    const user = userLookup.user;
    if(user.type === 'instructor'){
        return res.status(401).render('leave_class', {
            title: 'Error',
            error: 'You cannot leave classes as an instructor!.',
        });
    }
    const course = classLookup.class;
    if (!user.classes.includes(course._id.toString())) {
        return res.status(401).render('leave_class', {
            title: 'Error',
            error: 'You are not enrolled in this class.',
        });
    }
    return res.status(200).render('leave_class', {
        title: `Leave ${course.name}`,
        classId: course._id.toString(),
        className: course.name,
    });
});

Router.post('/:classId', async (req, res) => {
    const userLookup = await getUserByToken(req.session.token);
    if (userLookup.error) {
        return res.status(userLookup.statusCode).render('leave_class', {
            title: 'Error',
            error: userLookup.error,
        });
    }
    const classLookup = await getClassById(req.params.classId);
    if (classLookup.error) {
        return res.status(classLookup.statusCode).render('leave_class', {
            title: 'Error',
            error: classLookup.error,
        });
    }
    const user = userLookup.user;
    const course = classLookup.class;
    if(user.type === 'instructor'){
        return res.status(401).render('leave_class', {
            title: 'Error',
            error: 'You cannot leave classes as an instructor!.',
        });
    }
    if (!user.classes.includes(course._id.toString())) {
        return res.status(401).render('leave_class', {
            title: 'Error',
            error: 'You are not enrolled in this class.',
        });
    }
    const result = await removeStudentFromClass({
        studentToken: req.session.token,
        classId: req.params.classId,
    });
    if (result.error) {
        return res.status(result.statusCode).render('leave_class', {
            title: 'Error',
            error: result.error,
        });
    }
    return res.redirect('/dashboard');
});

module.exports = Router;
