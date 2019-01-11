'use strict';

var connection = require('../configs/conn');

//Task object constructor
var Account = function (account) {
    this.account_id = account.account_id;
    this.user_id = account.user_id;
    this.balance = account.balance;
};

Account.getAccountByUserId = function getAccountByUserId(userId, result) {
    connection.query("SELECT * from accounts " +
        "join users on accounts.user_id=users.user_id " +
        "where users.user_id=?", [userId], function (error, rows) {
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
}

Account.getAccountByAccountNumber = function getAccountByAccountNumber(accountNumber, req, result) {
    connection.query("SELECT * from accounts " +
        "join users on accounts.user_id=users.user_id " +
        "where account_number=? and users.user_id!=?", [accountNumber, req.user.user_id], function (error, rows) {
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
}

Account.setAccountBalance = function setAccountBalance(accountId, balance, response) {
    connection.query("update accounts SET balance=? where account_id=?", [balance, accountId], function (error, rows) {
        if (error) {
            response(error, null);
        } else {
            if (rows.length > 0) {
                response(null, rows[0]);
            } else {
                response(null, []);
            }
        }
    });
}


module.exports = Account;