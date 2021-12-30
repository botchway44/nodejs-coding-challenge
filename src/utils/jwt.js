const jwt = require('jsonwebtoken');
require("dotenv").config();

const accessTokenSecret = process.env.JWT_SECRET;

function JWTSign(email,name,accessTokenSecret ) {
    return jwt.sign({ name: name,  email: email }, accessTokenSecret);
}


const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

module.exports = {
    JWTSign : JWTSign,
    authenticateJWT : authenticateJWT
}; 