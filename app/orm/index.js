var bluebird = require('bluebird');
var _ = require('lodash');
var config = appRequire('config');
var tables = require('./tables');
var Tabel = require('tabel');

const Promise = bluebird;

var orm = new Tabel(config('orm'));

require('./tables')(orm);


module.exports = orm.exports;


