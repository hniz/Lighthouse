const checkValidId = (id) => {
    if (!id || typeof id !== 'string') {
        return false;
    }
    if (id.trim().length === 0) {
        return false;
    }
    return true;
};

module.exports = checkValidId;
