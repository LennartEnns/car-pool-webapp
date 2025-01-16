/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('UserToRide', (table) => {
        table.uuid('userID').notNullable();
        table.uuid('rideID').notNullable();
        table.boolean('paid').notNullable();
        table.boolean('bothWays').notNullable();
    
        table.primary(['userID', 'rideID']);
        table.foreign('userID').references('userID').inTable('User').onDelete('CASCADE');
        table.foreign('rideID').references('rideID').inTable('Ride').onDelete('CASCADE');
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTableIfExists('UserToRide');
}
