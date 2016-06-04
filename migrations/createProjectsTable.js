exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('projects', function(t) {
            t.increments('id');
            t.integer('user_id');
            t.string('type');
            t.string('title');
            t.string('short_description');
            t.string('idea');
            t.json('image_urls', true);
            t.json('details', true);
            t.timestamps();
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('projects')
    ]);
};