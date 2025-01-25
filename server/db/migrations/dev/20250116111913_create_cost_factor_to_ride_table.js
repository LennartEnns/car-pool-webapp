/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    // IMPORTANT: routeID has to be the same for the referenced CostFactor and Ride record
    return knex.schema.createTable('CostFactorToRide', (table) => {
        table.uuid('costFactorID').notNullable();
        table.uuid('rideID').notNullable();
    
        table.primary(['costFactorID', 'rideID']);
        table.foreign('costFactorID').references('costFactorID').inTable('CostFactor').onDelete('CASCADE');
        table.foreign('rideID').references('rideID').inTable('Ride').onDelete('CASCADE');
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTableIfExists('CostFactorToRide');
}
