'use strict';

module.exports = function (app) {
    var example = require('./controllers/ExampleController');
    app.route('/decrypt/:someData').get(example.decrypt);
    app.route('/encrypt/:someData').get(example.encrypt);


    var auth = require('./middleware/auth');

    var apiAuth = require('./controllers/ApiAuthController');
    app.route('/auth/login').post(apiAuth.login);
    app.route('/auth/logout').post(auth.isAuth, apiAuth.logout);

    var apiUser = require('./controllers/ApiUserController');
    app.route('/users').post(auth.isAuth, apiUser.users);
    app.route('/users/profile').post(auth.isAuth, apiUser.userProfile);

    var apiTransaction = require('./controllers/ApiTransactionController');
    app.route('/transaction/balance').post(auth.isAuth, apiTransaction.balance);
    app.route('/transaction/transfer').post(auth.isAuth, apiTransaction.transfer);
    app.route('/transaction/confirm').post(auth.isAuth, apiTransaction.confirm);
    app.route('/transaction/history').post(auth.isAuth, apiTransaction.history);
    app.route('/transaction/history-detail').post(auth.isAuth, apiTransaction.historyDetail);
};