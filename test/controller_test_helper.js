/**
 * Module dependencies.
 */

var http = require('http');
var req = http.IncomingMessage.prototype;
var res = http.ServerResponse.prototype;

/**
 * controller_test_helper
 */

var helper = exports;
var currentRoute;
var currentMiddleware;

var restoreRoute = function() {
  if (!currentRoute) { 
    return; 
  }
  currentRoute.middleware = currentMiddleware;
};

helper.finish = function() {
  restoreRoute();
};

var getRoute = helper.getRoute = function(route, app) {
  return app.get(route)[0] || app.post(route)[0];
};

helper.stubMiddlewareFor = function(route, app) {
  currentRoute = getRoute(route, app);
  currentMiddleware = currentRoute.middleware;
  currentRoute.middleware = [];
};

helper.setDefaultLocals = function() {
  var tools = []
  res.local('currentUser', { permissions: { tools: tools } });
  res.local('currentClients', []);
  res.local('currentClient', {});
  res.local('tools', tools);
};

helper.setLocal = function(name, value) {
  res.local(name, value);
};

helper.assert = {
  getJson: function(app, route, callback) {
    assert.response(app,
      { url: route, method: 'GET' },
      { status: 200, body: /^(?!\w*Error:).+/ },
    function(res) {
      callback(JSON.parse(res.body));
    });
  },
  postJson: function(app, route, callback) {
    assert.response(app,
      { url: route, method: 'POST' },
      { status: 200, body: /^(?!\w*Error:).+/ },
    function(res) {
      callback(JSON.parse(res.body));
    });
  }
};
