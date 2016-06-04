var seed = module.exports = function(gulp) {
  var Promise = require('bluebird');
  var config = appRequire('config');
  var args = process.argv.slice(3);
  var seeder = null;

  if (args[0] === '-f' && args[1] !== undefined) {
    seeder = args[1];
  }

  if (seeder) {
    return require(config.path('/seeds/' + seeder))().then(function() {
      return console.log(seeder + ' seeded');
    });
  } else {
    console.log(config.path('/seeds'));
    return Promise.reduce(require(config.path('/seeds')), function(_, seeder) {
      console.log(seeder);
      return require(config.path('/seeds/' + seeder))().then(function() {
        return console.log(seeder + ' seeded');
      });
    }, null);
  }
};
