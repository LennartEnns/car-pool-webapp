export default {
    development: {
      client: 'sqlite3',
      connection: {
        filename: ':memory:',
      },
      useNullAsDefault: true,
      seeds: {
        directory: './server/db/seeds/dev'
      },
    },
    production: {
      client: 'mssql',
      // connection: {
      //   user: process.env.DB_USER,
      //   password: process.env.DB_PASSWORD,
      //   database: process.env.DB_NAME,
      //   server: process.env.DB_SERVER,
      //   options: {
      //     encrypt: true,
      //     trustServerCertificate: true,
      //   },
      // },
      connection: process.env.DB_URL,
    },
};

// npx knex migrate:make create_additional_cost_infliction_table --knexfile ./server/db/knexfile.js --migrations-directory ./migrations/dev
