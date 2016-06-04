// server-wrapper.js
require('./appRequire')();
var orm  = appRequire('orm');

exports.defaults = orm.migrator.mount({
  devDir: './migrations',
  distDir: './migrations',
  stub: './migration.stub'
});
