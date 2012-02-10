var middleware = exports;
var User = require('../models/user_model');
var MongoHelper = require('../models/mongo_helper');

middleware.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    var selector = {_id: MongoHelper.bsonify(req.session.auth.user.id)};
    User.findOne(selector, function(err, user) {
      if (err || !user) {
        req.logout();
        res.send({ status: 'FAILURE', message: 'Failed to authenticate.'});
      } else {
        req.currentUser = user;
        next();
      }
    });
  } else {
    res.send({ status: 'FAILURE', message: 'Failed to authenticate.'});  
  }
}