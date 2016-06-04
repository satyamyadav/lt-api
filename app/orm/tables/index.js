module.exports = function(orm) {

  require('./users')(orm);
  require('./followers')(orm);
  require('./project_comments')(orm);
  require('./project_upvotes')(orm);
  require('./projects')(orm);

};
