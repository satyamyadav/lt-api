module.exports = function(orm) {
  orm.defineTable({
  name: 'project_upvotes',

    props: {
      key: 'id',

      autoId: false,

      perPage: 25,

      timestamps: true
    },
    processors: {
      model(row) { return row; },
      collection(rows) { return rows; }
    },
    scopes: {},

    // predefined joints on the table. Will talk about them more in scopes and joints section. `this` will be bound to the table instance.
    joints: {},

    // relations definitions for the table. Will talk about them more in scopes and joints section. `this` will be bound to the table instance.
    relations: {
      user: function () {
          return this.belongsTo('users', 'user_id');
      },
      
      projects: function () {
          return this.belongsTo('projects', 'project_id');
      }
    },

    // standard method definitions that you want to define for the table.
    // `this` will be bound to the table instance
    methods: {}
  });
};
