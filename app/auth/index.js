"use strict";

var passport         = require('passport');
var _                = require('lodash');
var BearerStrategy   = require('passport-http-bearer').Strategy
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy    = require('passport-local').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy   = require('passport-google-oauth2').Strategy;
var bcrypt           = require('bcryptjs');
var jwt              = require('jsonwebtoken'); // sign with default (HMAC SHA256)

/* load app modules*/
var config           = appRequire('config');
var orm               = appRequire('orm');
var db               = orm.table;
var table = orm.table;
var view             = appRequire('view');

/* load file speicfics*/
var authSecretKey    = config('auth.authSecretKey');
var sessionLifetime   = config('auth.sessionLifetime');
var facebookConfig   = config('auth.facebook');
var googleConfig     = _.extend(config('auth.google'), {passReqToCallback: true});
var twitterConfig    = config('auth.twitter');

var auth = module.exports = function() {
  // Custom Stratergy to handle auth for login
  // Custom Stratergy to handle auth for login
  passport.use('login', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
      session: false
    },
    function(req, email, password, done) {
      // Store hash in your password DB.
      table('users').find('email', email).then(function (user) {
        if(!user) {
          return done(null, false, { message: "User not found"});
        }
        bcrypt.compare(password, user.password, function (err, res) {
          if (res == true) {
            var token = jwt.sign(user.password, authSecretKey);
            return orm.cache.set(token, user.id, sessionLifetime)
              .then(function(contents) {
                user.access_token = token;
                return done(null, user, {scope: 'all'});
              });
          } else {
            return done(null, false, { message: "Invalid password"});
          }
        });
      });
    }
  ));

  // Custom Stratergy to handle auth for register
  passport.use('register', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
      session: false
    },
    function(req, email, password, done) {
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
          var token = jwt.sign(hash, authSecretKey);
          // Store hash in your password table.
          return table('users').find("email", email).then(function(user) {
            if (user) {
              return done('user already exists', null);
            } else {
              //console.log('in auth saving', req.body);
              var data = {};
              data.email = email;
              data.password = hash;
              data.username = (req.body.email.split('@'))[0];
              data.full_name = req.body.full_name;
              data.details = !_.isUndefined(req.body.details) ? req.body.details : {};
              console.log('data to save: ', data);
              return table('users').insert(data).then(function(user) {
                //console.log('saved user:', user);
                return orm.cache.set(token, user.id, sessionLifetime)
                  .then(function(contents) {
                    user.access_token = token;
                    return done(null, user, {
                      scope: 'all'
                    });
                  });
              });
            }
          });
        });
      });

    }
  ));

  //token bearer auth setup
  passport.use(
    new BearerStrategy(
      function(token, done) {
        //console.log(token);
        orm.cache.get(token).
        then(function(userId) {
          table('users').find('id', userId).
          then(function(user) {
            return done(null, user, {
              scope: 'all'
            })
          });
        });
      }
    )
  );


};
