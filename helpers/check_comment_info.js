const checkUserInfo = require('../helpers/check_user_info');
const checkValidId = require('./check_valid_id');

const checkUpdatedCommentInfo = ({
    id,
    author,
    parent_post,
    content,
    endorse,
}) => {
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
    if (parent_post) {
        if (checkUserInfo.validateString(parent_post)) {
            changedFields.parent_post = parent_post;
        } else {
            errors.push('parent post');
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
    if (errors.length > 0) {
        const errorString = `Invalid ${errors.join(', ')}.`;
        return { error: errorString };
    } else return changedFields;
};

module.exports = checkUpdatedCommentInfo;
