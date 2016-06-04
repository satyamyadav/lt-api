require('../appRequire')();

var Promise = require('bluebird');
var _ = require('lodash');

var config = appRequire('config');
var db = appRequire('db');
var range = appRequire('util/range');

db.loadTables = function() {
    appRequire('db/tables')(db);
};

db.load().then(function() {
    db.cache('foo', {
            x: 1,
            y: 2
        }, 20).then(function() {
            return db.cache('foo').then(function(val) {
                console.log(val);
            });
        }).delay(21).then(function() {
            return db.cache('foo').then(function(val) {
                console.log(val);
            });
        })
        .then(function() {
            db.close();
        });
});