'use strict';

var connection = require('../configs/conn');

//Task object constructor
var User = function (user) {
    this.user_id = user.user_id;
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
    this.fullname = user.fullname;
    this.created_at = new Date();
};

User.getAllUser = function getAllUser(result) {
    connection.query('SELECT * FROM users', function (error, rows) {
        if (error) {
            result(null, error);
        } else {
            result(null, rows);
        }
    });
};

User.getUserById = function getUserById(userId, result) {
    connection.query('SELECT * FROM users where user_id=' + userId, function (error, rows) {
        if (error) {
            result(error, null);
        } else {
            if (rows.length > 0) {
                result(null, rows[0]);
            } else {
                result(null, []);
            }
        }
    });
};

User.getUserByUsernameEmail = function getUserById(usernameOrEmail, result) {
    connection.query("SELECT * FROM users where (username='" + usernameOrEmail + "' or email='" + usernameOrEmail + "')", function (error, rows) {
        if (error) {
            result(error, null);
        } else {
            if (rows.length > 0) {
                result(null, rows[0]);
            } else {
                result(null, []);
            }
        }
    });
};

User.setUserTokenLogin = function setUserTokenLogin(userId, token, result) {
    connection.query("update users SET token_login=? where user_id=?", [token, userId], function (error, rows) {
        if (error) {
            result(error, null);
        } else {
            if (rows.length > 0) {
                result(null, rows[0]);
            } else {
                result(null, []);
            }
        }
    });
};


module.exports = User;