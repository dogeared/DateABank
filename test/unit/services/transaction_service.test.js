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

var route = controller.transaction;

var controllerPost = function(test, expected) {
  test.controllers.assert.postJson(app, route, function(res) {
    res.status.should.equal(expected);
    test.finish();
  });  
}

describe('when submitting a transaction', function(it) {
  var transaction = { date: '2/2/2012', amount: '12.50', 
    desc: 'some description', category: 'some category'};
      
  beforeEach(function(test) {
    test.stub(mongodb, 'collection').yields(null, _collection);
    test.controllers.stubMiddlewareFor(route, app);
    test.controllers.setCurrentUser({ _id: 'foo' });
  });
  
  it('should be successful', function(test) {
    test.stub(_collection, 'insert', function(transaction, callback) {
        transaction._id = '1234';
        callback(null, [transaction]);
      });
    controllerPost(test, 'SUCCESS');
  });
  
  it('should fail', function(test) {
    test.stub(_collection, 'insert', function(transaction, callback) {
      callback(new Error("Problems!"));
    });
    controllerPost(test, 'FAILURE');
  })
})
