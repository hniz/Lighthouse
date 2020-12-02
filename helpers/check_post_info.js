const checkUserInfo = require('../helpers/check_user_info');

const checkUpdatedPostInfo= ({ id, title, author, content }) => {
    const changedFields = {};
    let errors = [];
    if(id){ // ID should not be changed, but we should have a valid string provided.
        if(!checkUserInfo.validateString(id)){
            errors.push('id');
        }
    }
    if(author){
        if(checkUserInfo.validateString(author)){
            changedFields.author = author;
        } else {
            errors.push('author');
        }
    }
    if(title){
        if(checkUserInfo.validateString(title)){
            changedFields.title= title;
        } else {
            errors.push('title');
        }
    }
    if(content){
        if(checkUserInfo.validateString(content)){
            changedFields.content = content;
        } else {
            errors.push('content');
        }
    }
    if(errors.length > 0){
        const errorString = `Invalid ${errors.join(', ')}.`;
        return { error: errorString};
    } else return changedFields;
};


module.exports = checkUpdatedPostInfo;