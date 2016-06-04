
exports.up = function(knex, Promise) {
      return Promise.all([
        knex.schema.createTable('project_comments', function (t) {
            t.increments('id');
            t.integer('user_id');
            t.integer('project_id');
            t.string('comment', 500);
            t.timestamps();

            t.index('project_id');
        })
    ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
        knex.schema.dropTable('project_comments')
    ]);
};
