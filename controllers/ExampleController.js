'use strict';

var response = require('../configs/res');
var crypto = require('../configs/crypto');

exports.encrypt = function (req, res) {
    response.format(200, crypto.encrypt(req.params.someData), res)
};

exports.decrypt = function (req, res) {
    response.format(200, crypto.decrypt(req.params.someData), res)
};