import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  const dataDir = path.resolve('./server/db/data/dev');
  const tables = {
    currencies: 'currency',
    users: 'user',
    vehicles: 'vehicle',
    routes: 'route',
    rides: 'ride',
    userToRide: 'userToRide',
    additionalCosts: 'additionalCost',
    additionalCostToRide: 'additionalCostToRide',
    additionalCostInfliction: 'additionalCostInfliction',
  };
  
  // Delete all existing entries
  for (let tableName of Object.values(tables)) {
    await knex(tableName).del();
  }

  return Promise.all(
    Object.entries(tables).map(([file, table]) => {
      const csvFilePath = path.join(dataDir, `${file}.csv`);
      const rows = [];

      return new Promise((resolve, reject) => {
        fs.createReadStream(csvFilePath)
          .pipe(csvParser({separator: ';'}))
          .on('data', (data) => rows.push(data))
          .on('end', async () => {
            try {
              if (rows.length === 0) {
                console.log(`Skipping seeding of ${table} because ${file}.csv is empty`);
                resolve();
                return;
              };
              await knex(table).insert(rows);
              console.log(`Seeded ${rows.length} records into ${table} from ${file}.csv`);
              resolve();
            } catch (err) {
              console.error(`Error seeding ${file}:`, err);
              reject(err);
            }
          })
          .on('error', reject);
      });
    })
  )
}
