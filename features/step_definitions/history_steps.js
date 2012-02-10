var helpers = require('../support/helpers');
var Transaction = require('../../lib/models/transaction_model');
var request = require('request');
var _ = require('underscore');

Given(/^the transaction data has been submitted$/, function(step) {
  var self = this;
  var mongo = helpers.connectMongo();
  
  mongo.open(function(err, db) {
    global.mongodb = db;
    _.each(self.transactions, function(transaction, index) {
      Transaction.insert(transaction, function(err, transaction) {
        if (err) throw err;
        if (index === self.transactions.length-1) {
          db.close();
          step.done();
        }
      })
    })
  })
})

When(/^I get the history$/, function(step) {
  var self = this;
  var endpoint = "http://localhost:3000/api/v1/history";

  request({
    method: 'GET',
    uri: endpoint
  }, function(err, res, body) {
    if (err) throw err;
    assert.equal(res.statusCode, 200);
    self.resBody = JSON.parse(body);
    step.done();
  })
});

Then(/^I should get back the history with ids$/, function(step) {
  var self = this;
  _.each(this.resBody.result, function(transaction, index) {
    assert.equal(transaction.date, self.transactions[index].date);
    assert.equal(transaction.amount, self.transactions[index].amount);
    assert.equal(transaction.description, self.transactions[index].description);
    assert.equal(transaction.category, self.transactions[index].category);
    assert.notEqual(transaction._id, null);
  })
  step.done();
});

When(/^I process transactions with the following dates$/, function(step, table) {
  var self = this;

  var ids = [];
  
  _.each(table.hashes(), function(row) {
    var transaction = _.find(self.resBody.result, function(transaction) {
      return (transaction.date === row.date)
    });
    
    ids.push(transaction._id);
  })
  
  var endpoint = "http://localhost:3000/api/v1/process";
  
  request({
    method: 'POST',
    uri: endpoint,
    json: {ids: ids}
  }, function(err, res, body) {
    if (err) throw err;
    assert.equal(res.statusCode, 200);
    self.resBody = res.body;
    step.done();
  })
});

var pullIds = function(transactions) {
  return _.map(transactions, function(transaction) {
    return { date: transaction.date, amount: transaction.amount, 
      description: transaction.description, category: transaction.category };
  });
}

Then(/^I should get back the following transactions$/, function(step, table) {
  assert.deepEqual(table.hashes(), pullIds(this.resBody.result));
  step.done();
});