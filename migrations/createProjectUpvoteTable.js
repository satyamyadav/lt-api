
  exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('project_upvotes', function (t) {
            t.increments('id');
            t.integer('user_id');
            t.integer('project_id');
            t.timestamps();
            t.boolean('is_downvoted');

            t.unique(['user_id', 'project_id']);
            t.index('project_id');
        })
    ]);
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('project_upvotes')
    ]);
};