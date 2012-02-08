/**
 * Module dependencies.
 */

/**
 * controllers - site.
 */
module.exports = function(app) {
  var routes = {
    index: '/'
  };
  
  app.get(routes.index, function(req, res){
    res.render('index', {
      title: 'bdd.js'
    });
  });
  
  return routes; 
};
