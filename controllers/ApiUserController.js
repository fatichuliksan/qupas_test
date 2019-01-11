'use strict';

var response = require('../configs/res');
var User = require('../models/users');
exports.users = function (req, res) {
    User.getAllUser(function (error, result) {
        if (error)
            response.format(500, error, res, result);
        response.format(200, result, res);
    });
};

exports.userProfile = function (req, res) {
    User.getUserById(req.user.user_id, function (error, result) {
        if (error)
            response.format(500, error, res, result);
        response.format(200, result, res);
    });
};