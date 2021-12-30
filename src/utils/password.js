
const bcrypt = require ('bcrypt');

const saltRounds = 10;

function saltPassword(password) {
    return bcrypt.hashSync(password, 10);
}

function comparePassword(password, hash) {
 return  bcrypt.compareSync(password, hash)
}

module.exports = {
    saltPassword : saltPassword,
    comparePassword : comparePassword
}; 