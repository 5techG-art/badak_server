const jwt = require('jsonwebtoken');
const createError = require('../error');

const verifyToken = (req, res, next) => {
    const token = req.headers.token
    // console.log(token);
    if (!token) return next(createError(401, "Sorry, You are not authenticated!"));

    jwt.verify(token, process.env.SECRETKEY, (err, user) => {
        if (err) return next(createError(401, "Token is not valid"));
        req.id = user;
        next()
    });
}

module.exports = verifyToken