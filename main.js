require('fast-url-parser').replace();
require('./appRequire')();

// So that JSON.stringify(date) doesn't fuck things up
Date.prototype.toJSON = Date.prototype.toString;


var passport = require('passport');
var config = appRequire('config');

// setup the server engine
appRequire('engine').setup(function(app) {

  // set up static file serving from node
  if (process.env.NODE_SERVE_STATIC === '1') {
    var publicDir = config('server.publicDir');
    app.use(require('serve-static')(publicDir));
  }

  app.use(passport.initialize());
  // load up app routes
  app.use(appRequire('routes'));
});
