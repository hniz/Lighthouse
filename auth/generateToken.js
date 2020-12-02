const bcrypt = require('bcrypt');

const generateToken = async () => {
    return await bcrypt.genSalt();
};

module.exports = generateToken;
