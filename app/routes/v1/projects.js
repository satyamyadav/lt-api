var app = module.exports = require('express')();
var _ = require('lodash');
var Promise = require('bluebird');
var passport = require('passport');
var slugy = require('slug');

var table = appRequire('orm').table;
var filters = appRequire('util/filters');
var projectExists = filters.projectExists;
var upvotedProjectExists = filters.upvotedProjectExists;


var authFilter = passport.authenticate('bearer', {
    session: false
});





app.get('/', function (req, res) {
    var q = table('projects');

    if(req.query.page && req.query.offset) {
        q.forPage(req.query.page, req.query.offset);
    }

    if(req.query.page && req.query.per_page) {
        q.forPage(req.query.page, req.query.per_page);
    }

    if(req.query.orderBy) {
        q.orderBy(req.query.orderBy);
    
    } else {
        q.orderBy('created_at', 'desc');
        
    }
    Promise.props({
        projects: (
            q.eagerLoad('user', 'upvotes', 'comments').all()
        )
    }).then(function (data) {
        res.view('projects/model', data);

        //res.send('ola ola ', data);
    });

});


app.get('/:id', function (req, res) {
    var q = table('projects');
    Promise.props({
        projects: (
            table('projects').eagerLoad('user', 'upvotes', 'comments').find('id', req.params.id)
        )
    }).then(function (data) {
        res.view('projects/model', data);
    });

});


app.post('/addproject', authFilter, function (req, res) {
    var imageUrls = _.isArray(req.body.image_urls) ? req.body.image_urls: [];
    var details = req.body.type == 'blog' ? req.body.details : _.isArray(req.body.details) ? req.body.details: [];
    var data = {
        user_id: req.user.id,
        title: req.body.title,
        short_description: req.body.short_description,
        idea: req.body.idea,
        type: req.body.type,
        image_urls: { images: imageUrls },
        details: { details: details }
    }

    Promise.props(
        table('projects').insert(data)
    ).then(function (data) {
        res.status(200).send({msg: 'added'});
    },
    function (err) {
        res.status(400).send({msg: 'opps 400'});
    });
});


app.post('/:projectId/comment', authFilter, projectExists, (req, res) => {
    var data = {};
    var project = req.resolved.project;
    _.extend(data, {
        user_id: req.user.id,
        project_id: project.id,
        comment: req.body.comment,
    });
    return table('project_comments').insert(data)
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

app.get('/:projectId/comments', projectExists, function (req, res) {
    var q = table('project_comments');
    Promise.props({
        comments: (
            table('project_comments').eagerLoad(['user']).whereIn('project_id', req.params.projectId).all()
        )
    }).then(function (data) {
        res.send(data);
    });

});

app.post('/:projectId/upvote', authFilter, projectExists, function (req, res) {
    var data = {};
    var project = req.resolved.project;
    _.extend(data, {
        user_id: req.user.id,
        project_id: project.id,
        is_downvoted: false,
    });
    return table('project_upvotes').insert(data)
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

app.delete('/:projectId/upvote', authFilter, upvotedProjectExists, function (req, res) {
    var data = {};
    var project = req.resolved.upvotedReview;
    return table('project_upvotes').del(project.id)
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

