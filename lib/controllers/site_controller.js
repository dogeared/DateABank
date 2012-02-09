/**
 * Module dependencies.
 */
var TransactionService = require('../services/transaction_service');
var HistoryService = require('../services/history_service');

/**
 * controllers - transaction.
 */
module.exports = function(app) {
  var routes = {
    transaction: '/api/v1/transaction',
    history: '/api/v1/history',
    process: '/api/v1/process'
  };
  
  var resCallback = function(res, err, result) {
    if (err) {
      res.send({status: "FAILURE", message: err.message});
    } else {
      res.send({status: "SUCCESS", result: result}); 
    }
  }
  
  app.post(routes.transaction, function(req, res) {
    TransactionService.submit(req.body, function(err, result) {
      resCallback(res, err, result);
    });
  });
  
  app.get(routes.history, function(req, res) {
    HistoryService.getAllHistory(function(err, result) {
      resCallback(res, err, result);
    });
  });
  
  app.post(routes.process, function(req, res) {
    HistoryService.process(req.body, function(err, result) {
      resCallback(res, err, result);
    })
  });
  
  return routes; 
};
