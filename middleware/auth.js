var jwt = require('jsonwebtoken');
var response = require('../configs/res');
var config = require('../configs/config');


var User = require('../models/users');
module.exports = {
    isAuth: (req, res, next) => {
        try {
            const token = req.headers["x-access-token"];
            var decoded = jwt.verify(token, config.JWTSECRET);
            if (new Date() <= new Date(decoded.expire)) {
                var result = User.getUserById(decoded.user_id, function (error, result) {
                    if (error)
                        response.format(500, error, res);
                    if (!result)
                        response.format(401, null, res, 'user not found');

                    if (decoded.token != result.token_login) {
                        response.format(401, null, res, 'invalid token');
                    } else {
                        req.user = decoded;
                        next();
                    }
                });

            } else {
                response.format(401, null, res, 'expired token');
            }
        } catch (err) {
            response.format(401, null, res, 'invalid token');
        }
    },

};