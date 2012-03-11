/**
 * Module dependencies.
 */
var testHelper = require('test_helper');
var describe = testHelper.describe(exports);
var app = testHelper.createTestServer();
var controller = require('controllers/site_controller')(app);
var service = require('services/transaction_service');
var _ = require('underscore')._

/**
  * Required modules for stubbing
  */
var Transaction = require('models/transaction_model');

describe('when inserting a transaction', function(it) {
  var expectedDate = '2/2/2012';
  var testTransaction = { date: expectedDate, amount: '12.50',
    desc: 'some description', category: 'some category' };

  beforeEach(function(test) {
    test.stub(mongodb, 'collection').yields(null, _collection);
    test.stub(_collection, 'insert', function(transaction, callback) {
      callback(null, transaction);
    });
  });

  it('should convert a the passed in date string to a Date object', function(test) {
    Transaction.insert(testTransaction, function(err, transaction) {
      var gotDateObj = new Date(transaction.date);
      var gotDate = "" + (gotDateObj.getMonth()+1) + "/" +
        gotDateObj.getDate() + "/" + gotDateObj.getFullYear();
      assert.equal(expectedDate, gotDate);
      test.finish();
    });
  });
});
