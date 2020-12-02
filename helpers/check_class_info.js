const checkUserInfo = require('../helpers/check_user_info');

const checkUpdatedClassInfo = ({ name, description, students, tags, instructor}) => {
    const changedFields = {};
    let errors = [];
    if(name){
        if(checkUserInfo.validateString(name)){
            changedFields.name = name;
        } else{
            errors.push('name');
        }
    }
    if(description){
        if(checkUserInfo.validateString(description)){
            changedFields.description = description;
        } else {
            errors.push('description');
        }
    }
    if(instructor){
        if(checkUserInfo.validateString(instructor)){
            changedFields.instructor = instructor;
        } else {
            errors.push('instructor');
        }
    }
    if(students){
        if(Array.isArray(students)){
            let valid = true;
            students.forEach(student =>{
                if(typeof student !== 'string'){
                    errors.push('students');
                    valid = false;
                }
            });
            
            if(valid){
                changedFields.students = students;
            }

        } else {
            errors.push('students');
        }
    }
    if(tags){
        if(Array.isArray(tags)){
            let valid = true;
            tags.forEach(tag =>{
                if(typeof tag !== 'string'){
                    errors.push('tags');
                    valid = false;
                }
            });
            
            if(valid){
                changedFields.tags = tags;
            }

        } else {
            errors.push('tags');
        }
    }
    if(errors.length > 0){
        const errorString = `Invalid ${errors.join(', ')}.`;
        return { error: errorString};
    } else return changedFields;
};

module.exports = checkUpdatedClassInfo;
