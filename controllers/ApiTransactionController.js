'use strict';


var config = require('../configs/config');
var response = require('../configs/res');
var crypto = require('../configs/crypto');
var fn = require('../configs/function');

var Transaction = require('../models/transactions');
var Account = require('../models/accounts');
var now = new Date();

module.exports = {
    balance: (req, res) => {
        var account = Account.getAccountByUserId(req.user.user_id, function (error, result) {
            if (error)
                response.format(500, error, res, result);
            else
                response.format(200, {
                    'account_number': result.account_number,
                    'fullname': result.fullname,
                    'balance': result.balance
                }, res);
        });
    },
    transfer: (req, res) => {
        var {account_number, amount, message} = req.body;

        if (!account_number)
            response.format(401, null, res, 'account number is required');

        if (!amount)
            response.format(401, null, res, 'amount is required');

        if (amount < config.TRANSACTIONTFMIN)
            response.format(401, null, res, 'minimum amount is ' + config.TRANSACTIONTFMIN);

        if (amount > config.TRANSACTIONTFMAX)
            response.format(401, null, res, 'maximum amount is ' + config.TRANSACTIONTFMAX);

        Account.getAccountByAccountNumber(account_number, req, function (error, result) {
            if (error)
                response.format(500, error, res, result);

            if (!result)
                response.format(401, null, res, 'account number not found');
            else {
                response.format(200, {
                    'account_number': result.account_number,
                    'fullname': result.fullname,
                    'amount': amount,
                    'message': message,
                    'tf_token': crypto.encrypt(JSON.stringify({
                        'account_number': result.account_number,
                        'fullname': result.fullname,
                        'amount': amount,
                        'message': message,
                        'expired_time': fn.addMinute(now, 10),
                    }))
                }, res);
            }
        })

    },
    confirm: (req, res) => {
        var {tf_token, confirm} = req.body;
        if (confirm != 1)
            response.format(401, null, res, 'confirm required');

        if (!tf_token)
            response.format(401, null, res, 'invalid transfer token');
        try {
            tf_token = JSON.parse(crypto.decrypt(tf_token));
        } catch (e) {
            response.format(401, null, res, 'invalid transfer token');
        }

        try {
            if (new Date() > new Date(tf_token.expired_time)) {
                response.format(401, null, res, 'expired transfer token');
            } else {
                Account.getAccountByUserId(req.user.user_id, function (error, result) {
                    if (error)
                        response.format(500, error, res, result);
                    else {
                        Transaction.getRefNumber(function (error, ref_number) {
                            if (error)
                                response.format(500, error, res);

                            var from_account = {
                                'account_id': result.account_id,
                                'account_number': result.account_number,
                                'amount': parseInt(tf_token.amount),
                                'message': tf_token.message,
                                'balance': parseInt(result.balance),
                            };
                            if (tf_token.amount > result.balance) {
                                response.format(401, null, res, 'your balance is insufficient');
                            } else {
                                Account.getAccountByAccountNumber(tf_token.account_number, req, function (error, result) {
                                    if (error)
                                        response.format(500, error, res, result);
                                    else {
                                        if (!result) {
                                            response.format(401, null, res, 'account not found');
                                        } else {
                                            var to_account = {
                                                'account_id': result.account_id,
                                                'account_number': result.account_number,
                                                'amount': parseInt(tf_token.amount),
                                                'message': tf_token.message,
                                                'balance': parseInt(result.balance),
                                            };
                                            Transaction.createTransaction(2, 1, from_account.account_id, to_account.account_id, ref_number, to_account.amount, to_account.message,
                                                function (error, result) {
                                                    if (error)
                                                        response.format(500, error, res, result);
                                                    else {
                                                        Transaction.createTransaction(1, 1, to_account.account_id, from_account.account_id, ref_number, to_account.amount, to_account.message,
                                                            function (error, result) {
                                                                if (error)
                                                                    response.format(500, error, res, result);
                                                                else {
                                                                    try {
                                                                        Account.setAccountBalance(from_account.account_id, from_account.balance - from_account.amount, function (error, result) {
                                                                            if (error)
                                                                                response.format(500, error, res, result);
                                                                            else {
                                                                                Account.setAccountBalance(to_account.account_id, to_account.balance + to_account.amount, function (error, result) {
                                                                                    if (error)
                                                                                        response.format(500, error, res, result);
                                                                                    else
                                                                                        response.format(200, {
                                                                                            'ref_number': ref_number,
                                                                                            'from': from_account.account_number,
                                                                                            'to': to_account.account_number,
                                                                                            'amount': to_account.amount,
                                                                                            'message': to_account.message,
                                                                                        }, res, 'transfer success');

                                                                                });
                                                                            }
                                                                        });
                                                                    } catch (e) {
                                                                        response.format(500, error, res);
                                                                    }
                                                                }
                                                            });
                                                    }
                                                });
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }
        } catch (e) {
            response.format(500, e, res);
        }
    },
    history: (req, res) => {
        var {order, transaction_type_id} = req.body;
        Transaction.getTransactionHistory(req, order, transaction_type_id, function (error, result) {
            if (error)
                response.format(500, error, res);
            else
                response.format(200, result, res);
        })

    },

    historyDetail: (req, res) => {
        var {transaction_id} = req.body;
        Transaction.getTransactionByTransactionId(req, transaction_id, function (error, result) {
            if (error)
                response.format(500, error, res);
            else
                response.format(200, result, res);
        })

    },
};