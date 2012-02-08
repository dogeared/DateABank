
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

/**
 * Globals.
 */

global.inspect = require('eyes').inspector({ maxLength: 1000 });
var envPath = './config/environments/' + app.settings.env;
global.settings = require(envPath + '/settings');

/**
 * App configuration.
 */

app.configure(function(){
  app.set('views', __dirname + '/lib/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: settings.cookieSecret }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

/**
  * Global Exception Handlers
  */

process.on('uncaughtException', function(err) {
  console.error('Uncaught Exception: ' + err);
});

/**
 * Require all controllers.
 */

require(__dirname + '/lib/controllers/site_controller')(app);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
