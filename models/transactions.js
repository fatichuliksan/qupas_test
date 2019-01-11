'use strict';

var connection = require('../configs/conn');

//Task object constructor
var Transaction = function (transaction) {
    this.transaction_id = transaction.transaction_id;
    this.transaction_type_id = transaction.transaction_type_id;
    this.currency_id = transaction.currency_id;
    this.account_id = transaction.account_id;
    this.account_ref_id = transaction.account_ref_id;
    this.ref_number = transaction.ref_number;
    this.amount = transaction.amount;
    this.message = transaction.message;
    this.created_at = new Date();
};


Transaction.getBalance = function getUserById(account_number, result) {
    connection.query("SELECT * FROM users" +
        "join accounts on accounts.user_id=users.user_id" +
        " where account_number=?", [account_number], function (error, rows) {
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

Transaction.createTransaction = function createTransaction(transaction_type_id, currency_id, account_id, account_ref_id, ref_number, amount, message, result) {
    var sql = "INSERT INTO transactions (transaction_type_id, currency_id, account_id, account_ref_id, ref_number, amount, message)" +
        " VALUES (" + transaction_type_id + "," + currency_id + "," + account_id + "," + account_ref_id + "," + ref_number + "," + amount + ",'" + message + "')";
    connection.query(sql, function (error, rows) {
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

Transaction.getRefNumber = function getRefNumber(response) {
    var now = new Date();
    var date = "" + now.getDate();
    var date_pad = "00";
    var date_ans = date_pad.substring(0, date_pad.length - date.length) + date;

    var month = "" + now.getMonth() + 1;
    var month_pad = "00";
    var month_ans = month_pad.substring(0, month_pad.length - month.length) + month;

    connection.query("SELECT * FROM transactions where  transaction_type_id =2 and created_at LIKE ?",
        ['%' + now.getFullYear() + '-' + month_ans + '-' + date_ans + '%'], function (error, rows) {
            if (error)
                response(error);


            var str = "" + rows.length;
            var pad = "000000";
            var ans = pad.substring(0, pad.length - str.length) + str;
            console.log(rows);
            response(null, now.getFullYear() + '' + month_ans + '' + date_ans + '' + ans);
        });
};

Transaction.getTransactionHistory = function getTransactionHistory(req, order = "asc", transaction_type_id, result) {
    var sql = " select t.transaction_id, t.created_at, tt.type_name, t.ref_number, t.amount, t.message from transactions t " +
        "join transaction_types tt on tt.transaction_type_id=t.transaction_type_id " +
        "join accounts a on a.account_id=t.account_id " +
        "join users u on u.user_id=a.user_id " +
        "where u.user_id=" + req.user.user_id;
    if (transaction_type_id) {
        sql += " and  t.transaction_type_id=" + transaction_type_id
    }

    if (order == 'asc' || order == 'desc') {
        order = order
    } else {
        order = 'asc';
    }

    sql += " order by created_at " + order;

    connection.query(sql, function (error, rows) {
        if (error) {
            result(error, null);
        } else {
            result(null, rows);
        }
    });
};

Transaction.getTransactionByTransactionId = function getTransactionByTransactionId(req, transactionId, result) {
    var sql = " select * from transactions t " +
        "join transaction_types tt on tt.transaction_type_id=t.transaction_type_id " +
        "join accounts a on a.account_id=t.account_id " +
        "join users u on u.user_id=a.user_id " +
        "where u.user_id=" + req.user.user_id + " and t.transaction_id=" + transactionId;

    connection.query(sql, function (error, rows) {
        if (error) {
            result(error, null);
        } else {
            if (rows.length > 0) {
                var data = {
                    'transaction_id': rows[0].transaction_id,
                    'transaction_type': rows[0].type_name,
                    'ref_number': rows[0].ref_number,
                    'amount': rows[0].amount,
                    'message': rows[0].message,
                    'datetime': rows[0].created_at,
                };
                result(null, data);
            } else {
                result(null, []);
            }
        }
    });
}

module.exports = Transaction;