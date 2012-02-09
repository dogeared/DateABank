var mongodb = require('mongodb');

var Util = module.exports = {
  connectMongo: function() {
  return new mongodb.Db(
    settings.databases.mongo.database,
    new mongodb.Server(settings.databases.mongo.host,
      settings.databases.mongo.port, {}),
      {native_parser:false}
    );
  }
};