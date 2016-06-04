module.exports = function(orm) {
  orm.defineTable({
  // the table's name, is required, should be a string
    name: 'projects',

    // table properties
    props: {
      key: 'id',
      // default key column, can be ['user_id', 'post_id'] for composite keys

      autoId: false,
      // set this to true if you want the orm to generate a 36 character
      // uuid for your inserts. The orm checks for uniqueness of the uuid
      // when its generating it.
      // Can generate composite keys.
      // If using autoId on postgres, use uuid column for your key(s)
      // If using autoId on any other db, use a 36 length varchar

      perPage: 25,
      // standard batch size per page used by `forPage` method
      // table.forPage(page, perPage) method uses offset
      // avoid that and use a keyset in prod (http://use-the-index-luke.com/no-offset)

      timestamps: true
      // set to `true` if you want auto timestamps or
      // timestamps: ['created_at', 'updated_at'] (these are defaults when `true`)
      // will be assigned in this order only
    },

    // used to process model and collection results fetched from the db
    // override as you need to
    processors: {
      model(row) { return row; },
      collection(rows) { return rows; }
    },

    // predefined scopes on the table. Will talk about them more in scopes and joints section. `this` will be bound to the table instance.
    scopes: {},

    // predefined joints on the table. Will talk about them more in scopes and joints section. `this` will be bound to the table instance.
    joints: {},

    // relations definitions for the table. Will talk about them more in scopes and joints section. `this` will be bound to the table instance.
    relations: {
      user: function () {
                  return this.belongsTo('users', 'user_id');
              },
              comments: function () {
                  return this.hasMany('project_comments', 'project_id');
              },
              upvotes: function () {
                  return this.hasMany('project_upvotes', 'project_id');
              }
    },

    // standard method definitions that you want to define for the table.
    // `this` will be bound to the table instance
    methods: {}
  });
};
