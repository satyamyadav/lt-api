require('./appRequire')();

var gulp = module.exports = require('gulp');
var _ = require('lodash');

var tasks = require('./tasks');

_.forEach(tasks, function (task, name) {
    gulp.task(name, function () {
        task(gulp);
    });
});

gulp.task('default', function () {
    _.forEach(tasks, function (task, name) {
        console.log(name);
    });
});
