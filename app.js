
/**
 * Module dependencies.
 */

var express = require('express');
var connectAuth = require('connect-auth');
var mongodb = require('mongodb');
var MongoStore = require('connect-mongo');
var fs = require('fs');
var path = require('path');
var FormStrategy = require('./lib/auth_strategies/FormStrategy');

var app = module.exports = express.createServer();

/**
 * Globals.
 */

global.inspect = require('eyes').inspector({ maxLength: 1000 });

global.settings = require('./config/settings');

var mongoConfig = settings.databases.mongo;
var authPart = '';
var sessionStoreSettings = {
   db: mongoConfig.database,
   host: mongoConfig.host,
   port: mongoConfig.port
};
if (process.env['NODE_ENV'] === 'production') {
  authPart =  process.env['MONGO_USER']+':'+process.env['MONGO_PWD']+'@';
  sessionStoreSettings.username = process.env['MONGO_USER'];
  sessionStoreSettings.password = process.env['MONGO_PWD'];
}
var connectStr = 'mongodb://'+authPart+mongoConfig.host+':'+mongoConfig.port+
  '/'+mongoConfig.database;

/**
 * App configuration.
 */

app.configure(function() {
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: settings.cookieSecret,
    store: new MongoStore(sessionStoreSettings)
  }));
  app.use(connectAuth(FormStrategy()));
  app.use(app.router);
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
 mongodb.connect(connectStr, function(err, db) {
   if (err) console.error(err);
   global.mongodb = db;
   fs.readdirSync(__dirname + '/lib/controllers').map(function(file) {
     var controller = path.basename(file, '.js');
     if (path.extname(file) !== '') {
       require(__dirname + '/lib/controllers/' + controller)(app);
     }
   });
   var port = parseInt(process.env.PORT) || 3000;
   app.listen(port);
   console.log("Express server listening on port %d in %s mode", 
    app.address().port, app.settings.env);
})

