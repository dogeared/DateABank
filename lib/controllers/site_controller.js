/**
 * Module dependencies.
 */
var TransactionService = require('../services/transaction_service');
var HistoryService = require('../services/history_service');
var authMW = require('../middleware/authentication');
var isAuthenticated = authMW.isAuthenticated;

/**
 * controllers - transaction.
 */
module.exports = function(app) {
  var routes = {
    transaction: '/api/v1/transaction',
    history: '/api/v1/history',
    process: '/api/v1/process',
    authenticate: '/api/v1/authenticate',
    logout: '/api/v1/logout'
  };
  
  var resCallback = function(res, err, result) {
    if (err) {
      res.send({status: "FAILURE", message: err.message});
    } else {
      res.send({status: "SUCCESS", result: result}); 
    }
  }
  
  app.post(routes.transaction, isAuthenticated, function(req, res) {
    TransactionService.submit(req.body, function(err, result) {
      resCallback(res, err, result);
    });
  });
  
  app.get(routes.history, isAuthenticated, function(req, res) {
    HistoryService.getAllHistory(function(err, result) {
      resCallback(res, err, result);
    });
  });
  
  app.post(routes.process, isAuthenticated, function(req, res) {
    HistoryService.process(req.body, function(err, result) {
      resCallback(res, err, result);
    })
  });
  
  app.post(routes.authenticate, function(req, res) {
    req.authenticate(['form'], function(err, authenticated) {
      if (!err && authenticated) {
        resCallback(res, null, "authenticated");
      } else {
        resCallback(res, err, "not authenticated");
      }
    });
  })
  
  app.get(routes.logout, function(req, res) {
    req.logout();
    resCallback(res, null, "logged out");
  })
  
  return routes; 
};
