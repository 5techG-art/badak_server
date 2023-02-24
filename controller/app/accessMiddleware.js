const db = require('../../config/database');
const createError = require('http-errors');

const accessMiddleware = (req, res, next) => {
    const userId = req.params.userId;

    db.query('SELECT request_id FROM userrequest WHERE id = ? AND accept = 1', [userId], (err, userRequestResult) => {
        if (err) {
            return next(createError(500, err.message));
        }

        if (userRequestResult.length === 0) {
            return next(createError(400, 'Your request has not been accepted by admin'));
        }

        const requestId = userRequestResult[0].request_id;

        db.query('SELECT access_from, access_to FROM users WHERE user_id = ?', [requestId], (err, userResult) => {
            if (err) {
                return next(createError(500, err.message));
            }

            if (userResult.length === 0) {
                return next(createError(404, 'User not found'));
            }

            const { access_from, access_to } = userResult[0];
            const currentTime = new Date().getTime();
            const accessFromTime = new Date(access_from).getTime();
            const accessToTime = new Date(access_to).getTime();
            if (currentTime >= accessFromTime && currentTime <= accessToTime) {
                req.id = requestId;
                next();
            } else {
                return next(createError(401, 'You plan has expired, PLease renew your plan or contact with admin'));
            }
        });
    });
};

module.exports = accessMiddleware;
