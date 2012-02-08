var soda = require('soda');

When(/^I open bdd.js$/, function(step) {
  var self = this;
  this.browser = soda.createClient({
      host: 'localhost'
    , port: 4444
    , url: 'http://localhost:3000'
    , browser: "googlechrome"
  });

  this.browser.session(function(err) {
    self.browser.open('/', function(err, body) {
      self.browser.waitForPageToLoad(5000, function(err) {
        step.done();
      })
    })
  })
});

Then(/^I should be welcomed by bdd.js$/, function(step) {
  var self=this;
  this.browser.assertElementPresent("xpath=//p[.='Welcome to bdd.js']", 
    function(err) {
      if(err) console.log(err.message)
      assert.ok(!err);
      self.browser.testComplete(function(error, body) {
        step.done();
      });
    }
  );
});