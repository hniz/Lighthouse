const checkUserInfo = require('../helpers/check_user_info');
const checkValidId = require('./check_valid_id');

const checkUpdatedPostInfo = ({ id, title, author, content, endorse }) => {
    const changedFields = {};
    let errors = [];
    if (!checkValidId(id)) {
        errors.push('id');
    }
    if (author) {
        if (checkUserInfo.validateString(author)) {
            changedFields.author = author;
        } else {
            errors.push('author');
        }
    }
    if (title) {
        if (checkUserInfo.validateString(title)) {
            changedFields.title = title;
        } else {
            errors.push('title');
        }
    }
    if (content) {
        if (checkUserInfo.validateString(content)) {
            changedFields.content = content;
        } else {
            errors.push('content');
        }
    }
    if (typeof endorse !== 'undefined') {
        if (endorse === 'true' || endorse === 'false') {
            changedFields.endorse = endorse === 'true';
        } else {
            errors.push('endorse');
        }
    }
    changedFields.time_submitted = String(new Date());
    if (errors.length > 0) {
        const errorString = `Invalid ${errors.join(', ')}.`;
        return { error: errorString };
    } else return changedFields;
};

module.exports = checkUpdatedPostInfo;
