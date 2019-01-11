'use strict';
var jwt = require('jsonwebtoken');

var response = require('../configs/res');
var crypto = require('../configs/crypto');
var config = require('../configs/config');
var fn = require('../configs/function');


var User = require('../models/users');
var now = new Date();


module.exports = {
    login: (req, res) => {
        var {username, password} = req.body;
        if (!username) {
            response.format(401, null, res, 'username is required');
        }

        if (!password) {
            response.format(401, null, res, 'password is required');
        }

        User.getUserByUsernameEmail(username, function (error, result) {
            if (error)
                response.format(500, error, res, result);
            if (!result)
                response.format(401, null, res, 'username or email not found');

            if (crypto.decrypt(result.password) != password)
                response.format(401, null, res, 'password not match');

            var token_login = fn.makeId();
            var token = jwt.sign({
                user_id: result.user_id,
                expire: fn.addMinute(now, config.JWTEXPIREDADDMINUTE),
                token: token_login
            }, config.JWTSECRET);
            if (token) {
                User.setUserTokenLogin(result.user_id, token_login, function (error) {
                    if (error)
                        response.format(500, error, res);
                });
                response.format(200, {'x-access-token': token}, res, 'login success, welcome ' + result.fullname);
            } else {
                response.format(500, error, res);
            }

        });
    },
    logout: (req, res) => {
        var userId = req.user.user_id;
        if (userId) {
            User.setUserTokenLogin(userId, null, function (error, result) {
                if (error)
                    response.format(500, error, res, result);
                response.format(200, null, res, 'logout success');
            })
        } else {
            response.format(401, null, res, 'user not authorized');
        }
    }
};