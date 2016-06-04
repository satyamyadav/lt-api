var _ = require('lodash');

module.exports = function (view, projects, includes, upvotedReviews, meta) {
    var projectProcess = projects.map(function (f) {
        return view('projects/model')(f, includes, upvotedReviews).data;
    });
    if(meta) {
        projectProcess = _.sortByOrder(projectProcess, ['upvote_count'], ['desc']);
    }
    return {
        data: projectProcess
    };
};