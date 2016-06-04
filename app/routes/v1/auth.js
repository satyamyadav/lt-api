var app               = module.exports = require('express')();
var passport          = require('passport');
var Promise           = require("bluebird");
var request           = require('request-promise');
var qs                = require('querystring');
var jwt               = require('jsonwebtoken'); // sign with default (HMAC SHA256)
var _                 = require('lodash');
var config            = appRequire('config');
var orm               = appRequire('orm');
var db = orm.table;

var authSecretKey     = config('auth.authSecretKey');
var sessionLifetime   = config('auth.sessionLifetime');
var fbScopes          = config('auth.facebook.scopes');


app.get(
  '/check',
  passport.authenticate('bearer', {
    session: false
  }),
  function (req, res) {
    res.send({msg: 'Logged In'});
  }
);

app.get(
  '/profile',
  passport.authenticate('bearer', {
    session: false
  }),
  function (req, res) {
      res.view('users/model', req.user);
  }
);

app.put(
  '/profile',
  passport.authenticate('bearer', {
    session: false
  }),
  function (req, res) {
    if (req.body.data) {
      var oldUser = req.user ;
      var newUser = req.body.data;
      var data = _.merge(oldUser, newUser);
      data.picture = !_.isNull(req.body.data.details.image_urls) && !_.isUndefined(req.body.data.details.image_urls) ? req.body.data.details.image_urls[0] : oldUser.details.image_urls[0];
      //console.log('new walas>>', JSON.stringify(data));
      db('users').update(req.user.id, data).then(function () {
        res.send({
          msg: 'User updated',
          data: req.body.data  // res.serialize('users/model', req.user)
        });
      });
    } else {
      res.send({
        msg: 'No Change',
        data: res.serialize('users/model', req.user)
      })
    }
  }
)




app.post('/login',
  passport.authenticate('login', {
    session: false
  }),
  function (req, res) {
    res.view('users/model', req.user);
  });

app.post('/register',
  /*userAlreadyExists,*/
  passport.authenticate('register', {
    session: false
  }),
  function (req, res) {
    res.view('users/model', req.user);
  });

/**
 * oAuth Flow for facebook postinging on wall
 * 
 * @param  { social_id: "123123", access_toke: "<oAuth token from oAuth provider>"
 * returns user object with access token
 */

app.post('/social/facebook/post', function(req, res) {
     // console.log('facebook ka req >>>> ', req.body);

  var graphBaseUri = 'https://graph.facebook.com/v2.4/';
  var uri = graphBaseUri +  req.body.social_id + '/photos?' + qs.stringify({
      message: 'Support Convergence-16 , a college fest @ SCRIET, Meerut, go to  http://scrietossdg.herokuapp.com/fb',
      url: 'https://scrietossdg.herokuapp.com/images/icards/fbcard' + req.body.user_id +'img.png',
      access_token: req.body.access_token,
    });
  /*var uri = graphBaseUri + 'me' + '?' + qs.stringify({
      access_token: req.body.access_token,
      fields: fbScopes.join(',')
    });*/
  var pictureUri = graphBaseUri + req.body.social_id + '/picture?type=large';
  var token = jwt.sign(req.body.access_token, authSecretKey);
  
  var options = {
    method: 'POST',
    uri: uri,
    /*body: {
      some: 'payload',
      access_token: req.body.access_token

    },*/
    json: true // Automatically stringifies the body to JSON
  };

  //console.log(options);

  request(options).then(function (fbRes) {

    //console.log('facebook ka res >>>> ', fbRes);

    var redirect_url = 'https://m.facebook.com/photo.php?fbid='+ fbRes.id +'&id=' + fbRes.post_id + '&prof&ls=your_photo_permalink';
    //var redirect_url = 'https://facebook.com?fbid='+ fbRes.id +'&id=' + fbRes.post_id;

    //res.send({redirect_url: redirect_url});
    return res.status(200).send({redirect_url:redirect_url});



    /*var fbUserProfile = fbRes;
    if(fbUserProfile.id === req.body.social_id) {
      _.extend(fbUserProfile, { picture: pictureUri});
      return db("users").find("email", fbUserProfile.email).then(function (user) {
        if (user) {
          var data = {};
          data = {
            social_accounts: {
              facebook: fbUserProfile.id
            },
            imported_data: {
              facebook: fbUserProfile
            },
            full_name: fbUserProfile.name,
            email: fbUserProfile.email,
            username: fbUserProfile.email
          };
          _.merge(user, data);
          return  db("users").update(user.id, user);
        } else {
          return db("users").createBySocialId({
              social_type: 'facebook',
              social_id: fbUserProfile.id, 
              profile: fbUserProfile}).then(function(user) {
                return user;
              }).catch(function (e) {
                return e;
              });
        }
      }).then(function (user) {
        return orm.cache.set(token, user.id, sessionLifetime)
          .then(function (contents) {
            user.access_token = token;
            return res.view('users/model', user);
          });
      });
    }*/

  }).catch(function (e) {
    console.log('catched error >>>', e.error);
    return res.status(500).send({msg:String(e)});
  });
});

/**
 * oAuth Flow for facebook login
 * 
 * @param  { social_id: "123123", access_toke: "<oAuth token from oAuth provider>"
 * returns user object with access token
 */

app.post('/social/facebook', function(req, res) {
    console.log('facebook ka req bina post pe  >>>> ', req.body);

  var graphBaseUri = 'https://graph.facebook.com/v2.4/';
  var uri = graphBaseUri + 'me' + '?' + qs.stringify({
      access_token: req.body.access_token,
      fields: fbScopes.join(',')
    });
  var pictureUri = graphBaseUri + req.body.social_id + '/picture?type=large';
  var token = jwt.sign(req.body.access_token, authSecretKey);
  request(uri, {
    json: true
  }).then(function (fbRes) {
    var fbUserProfile = fbRes;
    if(fbUserProfile.id === req.body.social_id) {
      _.extend(fbUserProfile, { picture: pictureUri});
      return db("users").find("email", fbUserProfile.email).then(function (user) {
        if (user) {
          var data = {};
          data = {
            social_accounts: {
              facebook: fbUserProfile.id
            },
            imported_data: {
              facebook: fbUserProfile
            },
            full_name: fbUserProfile.name,
            email: fbUserProfile.email,
            username: fbUserProfile.email
          };
          _.merge(user, data);
          return  db("users").update(user.id, user);
        } else {
          return db("users").createBySocialId({
              social_type: 'facebook',
              social_id: fbUserProfile.id, 
              profile: fbUserProfile}).then(function(user) {
                return user;
              }).catch(function (e) {
                return e;
              });
        }
      }).then(function (user) {
        return orm.cache.set(token, user.id, sessionLifetime)
          .then(function (contents) {
            user.access_token = token;
            return res.view('users/model', user);
          });
      });
    }

  }).catch(function (e) {
    return res.status(500).send({msg:String(e)});
  });
});

/**
 * oAuth Flow for google plus
 * 
 * @param  { social_id: "123123", access_toke: "<oAuth token from oAuth provider>"
 * returns user object with access token
 */
app.post(
  '/social/google',
  function (req, res) {
    var uri = 'https://www.googleapis.com/oauth2/v2/userinfo' + '?' + qs.stringify({
      access_token: req.body.access_token
    });
    request(uri, {
      json: true
    }).then(function (googleRes) {
      var token = jwt.sign(req.body.access_token, authSecretKey);
      var googleUserProfile = googleRes;
      if (googleUserProfile.id === req.body.social_id) {
        return db("users").find("email", googleUserProfile.email)
          .then(function (user) {
            if (user) {
              var data = {};
              data = {
                social_accounts: {
                  google: googleUserProfile.id
                },
                imported_data: {
                  google: googleUserProfile
                },
                full_name: googleUserProfile.name,
                email: googleUserProfile.email,
                username: googleUserProfile.email
              };
              _.merge(user, data);
              return db("users").insert(user);
            } else {
              return db("users").createBySocialId({
                  social_type: 'google',
                  social_id: googleUserProfile.id,
                  profile: googleUserProfile
                });
            }
          }).then(function (user) {
            return orm.cache.set(token, user.id, sessionLifetime)
              .then(function (contents) {
                user.access_token = token;
                return res.view('users/model', user);
              });
          });
      } else {
        return res.status(400).send({
          "message": "Invalid credintials"
        });
      }
    }, function (googleRes) {
      return res.status(googleRes.statusCode).send(googleRes.response.body);
    });
  }
);