var path = function(path) {
  return require('path').normalize(__dirname + '/../..' + path);
};
var package = require(path('/package.json'));

module.exports = {
  path: path,

  name: package.name,

  api: {
    defaultVersion: 'v1',
    versions: ['v1']
  },
  serviceApi: {
    development: {
      baseUrl: 'http://localhost:3030'
    },
    production: {
      baseUrl: 'http://localhost:3000'
    }
  },
  server: {
    port: 3030,
    uploadsDir: path('/storage/uploads'),
    publicDir: path('/public')
  },

  redis: {
    development: {
      host: '0.0.0.0',
      port: '6379',
      dbCachePrefix: '_div.cache'
    },
    production: {
      host: 'localhost',
      port: '6379',
      dbCachePrefix: '_div.cache'
    },
    staging: {
      host: 'localhost',
      port: '6379',
      dbCachePrefix: '_div.cache'
    }
  },

  orm: {
    cacheEnabled: true,

    development: {
      db: {
        client: 'postgresql',
        connection: {
          database: 'dccdf5460marrs',
          host: "ec2-23-21-219-12.compute-1.amazonaws.com",
          port: 5432,
          user: 'hclirtnhbtlgrh',
          password: 'ZZnuGNBSU0mPmPKDx2Zx0GZcI_',
          ssl: true

        },
        pool: {
          min: 2,
          max: 10
        },
        migrations: 'knex_migrations'
      },
      // redis config is optional, is used for caching by tabel
      redis: {
        host: 'pub-redis-15073.us-east-1-4.3.ec2.garantiadata.com',
        port: '15073',
        keyPrefix: 'dev.api.',
        password: 'scrietredis'

      }
    },
    production: {
      db: {
        client: 'postgresql',
        connection: {
          database: 'lt_dev',
          host: "localhost",
          port: 5432,
          user: 'lt_dev',
          password: 'lt_dev'
        },
        pool: {
          min: 2,
          max: 10
        },
        migrations: 'knex_migrations'
      },
      // redis config is optional, is used for caching by tabel
      redis: {
        host: '0.0.0.0',
        port: '6379',
        keyPrefix: 'dev.api.'
      }
    }
  },
  
  auth: {
    development: {

      authSecretKey: '5UP31253CU123', // replace with rsa_key.cert or etcs for signing secure tokens

      sessionLifetime: 5 * 24 * 3600 * 1000,

      facebook: {
        clientID: '123123123',
        clientSecret: '123123123',
        callbackURL: 'http://localhost:3030/auth/facebook/callback',
        scopes: ['picture', 'about', 'email', 'bio', 'birthday', 'devices', 'education', 'first_name', 'gender', 'hometown', 'id', 'age_range']
      },

      google: {
        clientID: '123123123',
        clientSecret: '123123123',
        callbackURL: 'http://localhost:8080/auth/google/callback'
      },

      twitter: {
        consumerKey: 'your-consumer-key-here',
        consumerSecret: 'your-client-secret-here',
        callbackURL: 'http://localhost:8080/auth/twitter/callback'
      }

    },
    staging: {

      authSecretKey: '5UP31253CU123', // replace with rsa_key.cert or etcs for signing secure tokens

      sessionLifetime: 5 * 24 * 3600 * 1000,

      facebook: {
        clientID: '123123123',
        clientSecret: '123123123',
        callbackURL: '123123123',
        scopes: ['picture', 'about', 'email', 'bio', 'birthday', 'devices', 'education', 'first_name', 'gender', 'hometown', 'id', 'age_range']
      },

      twitter: {
        consumerKey: 'your-consumer-key-here',
        consumerSecret: 'your-client-secret-here',
        callbackURL: 'http://localhost:8080/auth/twitter/callback'
      },

      google: {
        clientID: 'sgfdgdfsgd.apps.googleusercontent.com',
        clientSecret: 'segdgdfvgdfv-UJVZc6wgIRNf',
        callbackURL: '123123123',
      }

    },
    production: {

      authSecretKey: '5UP31253CU123', // replace with rsa_key.cert or etcs for signing secure tokens

      sessionLifetime: 5 * 24 * 3600 * 1000,

      facebook: {
        clientID: 'your-secret-clientID-here', // your App ID
        clientSecret: 'your-client-secret-here', // your App Secret
        callbackURL: 'http://localhost:8080/auth/facebook/callback',
        scopes: ['picture', 'about', 'email', 'bio', 'birthday', 'devices', 'education', 'first_name', 'gender', 'hometown', 'id', 'age_range']
      },

      twitter: {
        consumerKey: 'your-consumer-key-here',
        consumerSecret: 'your-client-secret-here',
        callbackURL: 'http://localhost:8080/auth/twitter/callback'
      },

      google: {
        clientID: 'your-secret-clientID-here',
        clientSecret: 'your-client-secret-here',
        callbackURL: 'http://localhost:8080/auth/google/callback'
      }

    },

  }
};
