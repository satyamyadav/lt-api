
exports.up = function(knex, Promise) {
      return Promise.all([
        knex.schema.createTable('followers', function (t) {
            t.increments('id');
            t.integer('user_id');
            t.integer('follow_id');
            t.timestamps();
        })
    ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
        knex.schema.dropTable('followers')
    ]);
};
