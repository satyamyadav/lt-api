module.exports = function(orm) {
  orm.defineTable({
  name: 'followers',

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
    joints: {
      joinUser: function() {
        return this.joint(function(q) {
          q.join(
            'followers',
            'followers.follow_id', '=', 'users.id'
          );
        });
      }
    },

    // relations definitions for the table. Will talk about them more in scopes and joints section. `this` will be bound to the table instance.
    relations: {
      /*follower : function () {
        return this.belongsTo('users', 'follow_id')
      }*/
    },

    // standard method definitions that you want to define for the table.
    // `this` will be bound to the table instance
    methods: {}
  });
};
