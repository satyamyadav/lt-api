var _ = require('lodash');
var Promise = require('bluebird');
var passport = require('passport');
var db = appRequire('orm').table;

function initResolved(req) {
    req.resolved = _.isUndefined(req.resolved) ? {} : req.resolved;
};

var filters = module.exports = {
    userAlreadyExists: function(req, res, next) {
        return db('users').find('email', req.body.email)
            .then(function(user) {
                if (user) {
                    res.status(400).send({
                        message: "user already exsists"
                    });
                } else {
                    next();
                }
            });
    },

    isLoggedIn: passport.authenticate('bearer', {
                  session: false
    }),

    getAuthToken: (req, res, next) => {
      initResolved(req);
      if(req.headers.hasOwnProperty['headers']) {
        //console.log(req.headers);
        req.resolved.token = req.headers.authorization.split(' ')[1];
        next();
      } else {
        next();
      }
    },

    userExists: function (req, res, next) {
        initResolved(req);
        return db('users').eagerLoad(['followers']).find('username', req.params.username)
            .then(function (user) {
                if (user) {
                    req.resolved.user = user;
                    return next();
                } else {
                    res.status(404).send({
                        message: "Profile Not found"
                    });
                }
            });
    },

    
    projectExists: function (req, res, next) {
        initResolved(req);

        db('projects').find(req.params.projectId)
            .then(function (project) {
                if (project) {
                    req.resolved.project = project;
                    next();
                } else {
                    res.status(404).send({
                        msg: 'Not Found'
                    });
                }
            });
    },


    upvotedProjectExists: function (req, res, next) {
        initResolved(req);

        db('project_upvotes').where('project_id', req.params.reviewId).where('user_id', req.user.id).first()
            .then(function (project) {
                if (project) {
                    req.resolved.upvotedProject = project;
                    next();
                } else {
                    res.status(404).send({
                        msg: 'Not Found'
                    });
                }
            });
    },


    isFollowing: function (req, res, next) {
        initResolved(req);

        db('followers').where('user_id', req.params.id).where('follow_id', req.user.id).first()
            .then(function (follower) {
                //console.log('filter followers>>>', follower);
                if (follower) {
                    req.resolved.follower = follower;
                    next();
                } else {
                    res.status(404).send({
                        msg: 'Not Found'
                    });

                }
            });
    },


    validAuthHeader: function (req, res, next) {
        // Filter which can be placed on public route
        // if authorization headers contain valid token
        // set user in in req.user
        if (req.headers && req.headers.authorization) {
            var parts = req.headers.authorization.split(' ');
            if (parts.length == 2) {
                var scheme = parts[0],
                    credentials = parts[1];

                if (/^Bearer$/i.test(scheme)) {
                    token = credentials;
                    db.cache(token)
                        .then(function (userId) {
                            db('users').find('id', userId).
                            then(function (user) {
                                req.user = user;
                                next();
                            });
                        });
                }
            } else {
                next();
            }
        } else {
            next();
        }
    }
};
