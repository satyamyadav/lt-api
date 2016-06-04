var uuid = require('uuid');
var faker = require('faker');
var bcrypt = require('bcryptjs');
var Promise = require('bluebird');

var range = appRequire('util/range');
var db = appRequire('orm').table;

module.exports = function() {
    //return db('projects').truncate().then(function() {
        return Promise.all(range(1, 1).map(function(n) {
            var UserId = Math.floor((Math.random() * 10) + 1);
            return db('projects').insert({

                
                user_id: UserId,
                title: faker.lorem.sentence(),
                short_description: faker.lorem.sentences(),
                idea: faker.lorem.sentences(),
                type: 'blog',
                image_urls: { images: [] },
                details: { post: faker.lorem.sentences() }
                  


            });
        }));
    //});
};
