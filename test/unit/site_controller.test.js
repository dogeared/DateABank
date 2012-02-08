/**
 * Module dependencies.
 */

var testHelper = require('test_helper');
var describe = testHelper.describe(exports);

var app = testHelper.createTestServer();
var controller = require('controllers/site_controller')(app);

/**
  * test - controller - site
  */
  
describe('GETS index', function(it) {
  var route = controller.index;
  
  it('has a welcome message', function(test) {
    test.controllers.assert.get(app, route, function(err, $) {
      $('p').text().should.include.string('Welcome to bdd.js');
      test.finish();      
    });
  });
});