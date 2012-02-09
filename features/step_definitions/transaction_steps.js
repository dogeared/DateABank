var request = require('request');
var helpers = require('../support/helpers');

Given(/^I have the following transaction data$/, function(step, table) {
  this.transactions = table.hashes();
  this.transaction = this.transactions[0];
  step.done();
});

When(/^I submit the transaction$/, function(step) {
  var self = this;
  var endpoint = "http://localhost:3000/api/v1/transaction";
  
  request({
    method: 'POST',
    uri: endpoint,
    json: self.transaction
  }, function(err, res, body) {
    if (err) throw err;
    assert.equal(res.statusCode, 200);
    self.resBody = res.body;
    step.done();
  })
});

Then(/^I should get a successful response$/, function(step) {
  var body = this.resBody;
  assert.equal(body.status, "SUCCESS");
  var mongo = helpers.connectMongo();

  mongo.open(function(err, db) {
    db.collection('transactions', function(err, collection) {
      collection.find().toArray(function(err, results) {
        assert.equal(body.result[0]._id,results[0]._id);
        step.done();
      })
    })
  })
});