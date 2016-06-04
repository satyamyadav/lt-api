var app = module.exports = require('express')();
var table = appRequire('orm').table;
var Promise = require('bluebird');
var passport = require('passport');
var _ = require('lodash');
var filters = appRequire('util/filters')
var userExists = filters.userExists;
var isFollowing = filters.isFollowing;
var isLoggedIn = filters.isLoggedIn;

var authFilter = passport.authenticate('bearer', {
    session: false
});


app.get('/followers', function (req, res) {
  table('followers').all()
  .then(function (data) {
    //console.log(data);
    res.send(data);
  });
});



app.post('/follow/:id', authFilter, function (req, res) {
    table('followers').where('user_id', req.params.id).where('follow_id', req.user.id).first()
        .then(function (follower) {
            //console.log('user followers>>>', follower);
            if (follower) {
                /*req.resolved.follower = follower;
                next();*/
                res.status(404).send({
                    msg: 'Not Found'
                });
            } else {
              var data = {};
              _.extend(data, {
                  user_id: req.params.id,
                  follow_id: req.user.id,
              });
              return table('followers').insert(data)
                  .then(function (data) {
                      return data;
                  }).then(function (data) {
                      res.send({
                          msg: data
                      });
                  }).catch(function (e) {
                      res.status(500).send({
                          msg: 'Something went wrong, contact a dev'
                      });
                  });  
            }
        });


});
/*
app.delete('/unfollow/:id', authFilter, function (req, res) {
    console.log(req.user.id);
    var data = {};
    var q = table('followers');
    q.del('follow_id', req.user.id)

        .then(function (success) {
          console.log('delete ke bad ', data);
            res.send({
                msg: data
            });
        }).catch(function (e) {
            res.status(500).send({
                msg: 'Something went wrong, contact a dev'
            });
        });
});*/

app.delete('/unfollow/:id', authFilter, isFollowing, function (req, res) {
    var follow = req.resolved.follower;
    //console.log('isFollowing >>', follow);
    return table('followers').del(follow.id)
        .then(function (data) {
            return data;
        }).then(function (data) {
            res.send({
                msg: data
            });
        }).catch(function (e) {
            res.status(500).send({
                msg: 'Something went wrong, contact a dev'
            });
        });
});



app.get('/profile/social/:username', userExists, function (req, res) {
    var q = table('projects');
    if(req.query.page && req.query.offset) {
        q.forPage(req.query.page, req.query.offset);
    }

    if(req.query.page && req.query.per_page) {
        q.forPage(req.query.page, req.query.per_page);
    }

    Promise.props({
            
        projects: q.eagerLoad('user', 'upvotes', 'comments').whereIn('user_id', req.resolved.user.id).all(),
        data: req.resolved.user

    }).then(function (data) {
        //res.view('users/model', user);
        res.send(data);
    },
    function(err){
        var data = {
            projects: [],
            data: req.resolved.user
        }
        res.send(data);
        //res.send({msg:"not found"});
    });
});

app.get('/profile/:username', userExists, function (req, res) {
    res.view('users/model', req.resolved.user);
});

app.get('/profile/:id', function (req, res) {
    table('users').eagerLoad(['projects', 'followers']).find('id', req.params.id).then(function (data) {
        //res.view('users/model', user);
        res.send(data);
    });
});



app.get('/', (req, res) => {
  //console.log('user in /users>>>', req.user);
  var orderBy = req.query.orderBy ? req.query.orderBy : 'id';
  var page = req.query.page ? req.query.page : 1;
  var page = req.query.page ? req.query.page : 1;
  var q = table('users');
  
  if(req.query.page && req.query.offset) {
      q.forPage(req.query.page, req.query.offset);
  }

  if(req.query.page && req.query.per_page) {
      q.forPage(req.query.page, req.query.per_page);
  }
  q.orderBy(orderBy, 'desc');
  
  q.eagerLoad(['followers']).all()
  .then((users) => {
    res.view('users/list', users);
  })
  .catch((err) => {
    res.send(err);
  });
});

app.get('/:id', function(req, res) {
  var resourceId = req.params.id ? req.params.id : 1;
  var eagerLoads = !_.isUndefined(req.query.relations) ? req.query.relations : [];
  var q = table('users');

  q.eagerLoad(['followers']).find('id', resourceId)
  //q.find('id', resourceId)
  .then((user) => {
    res.view('users/model', user);
  })
  .catch((err) => {
    res.send(err);
  });
});

