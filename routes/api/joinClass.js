const { getClassByCode, addStudentToClass } = require('../../data/classes');

const Router = require('express').Router();

Router.post('/', async (req, res) => {
    const code = req.body['class-code'];
    const classLookup = await getClassByCode(code);
    if (classLookup.error) {
        res.status(classLookup.statusCode).json({ error: classLookup.error });
        return;
    }
    const password = req.body['class-password'];
    if (classLookup.class.password === password) {
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
