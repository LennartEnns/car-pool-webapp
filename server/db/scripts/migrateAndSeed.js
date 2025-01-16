import knex from 'knex';
import knexConfig from '../knexfile.js';

const runMigrationsAndSeeds = async () => {
  const db = knex(knexConfig[process.env.NODE_ENV || 'development']);

  try {
    console.log('Running migrations...');
    await db.migrate.latest({
        directory: './server/db/migrations/dev'
    });
    console.log('Migrations complete.\n');

    console.log('Running seeds...');
    await db.seed.run();
    console.log('Seeding complete.\n');
  } catch (error) {
    console.error('Error during migration or seeding:', error);
  } finally {
    await db.destroy();
    console.log('Migration and seeding complete.\n');
  }
};

runMigrationsAndSeeds();
