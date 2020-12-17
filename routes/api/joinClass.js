const { getClassByCode, addStudentToClass } = require('../../data/classes');
const Router = require('express').Router();
const xss = require('xss');
const { getUserByToken } = require('../../data/users');

Router.post('/', async (req, res) => {
    const code = xss(req.body['class-code']);
    const classLookup = await getClassByCode(code);
    const userLookup = await getUserByToken(req.session.token);
    if (classLookup.error) {
        res.status(classLookup.statusCode).json({ error: classLookup.error });
        return;
    }
    if (userLookup.error) {
        res.status(userLookup.statusCode).json({ error: userLookup.error });
        return;
    }
    if (userLookup.user.type === 'instructor') {
        return res.status(401).json({ error: 'Instructors cannot join classes.' });
    }
    const password = xss(req.body['class-password']);
    if (classLookup.class.password === password) {
        if(classLookup.class.students.includes(userLookup.user._id.toString())){
            return res.status(400).json({ error: 'Already in this class.' });
        }
        const result = await addStudentToClass({
            studentToken: req.session.token,
            classCode: code,
        });
        if (result.error) {
            res.status(result.statusCode).json({ error: result.error });
        } else {
            res.status(200).send();
        }
    } else {
        res.status(404).json({ error: 'Invalid Class Code/Email.' });
    }
});

module.exports = Router;
