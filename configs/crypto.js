'use strict';

var crypto = require('crypto');

var key = 'mypassword';

exports.encrypt = function (someToEncrypt) {
    var cipher = crypto.createCipher('aes-128-cbc', key);
    var mystr = cipher.update(someToEncrypt, 'utf8', 'hex') + cipher.final('hex');
    return mystr;
};

exports.decrypt = function (someToDecrypt) {
    var cipher = crypto.createDecipher('aes-128-cbc', key);
    var mystr = cipher.update(someToDecrypt, 'hex', 'utf8') + cipher.final('utf8');
    return mystr;
};

