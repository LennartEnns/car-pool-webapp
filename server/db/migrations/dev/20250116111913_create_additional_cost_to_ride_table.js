/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    // IMPORTANT: routeID has to be the same for the referenced AdditionalCost and Ride record
    return knex.schema.createTable('AdditionalCostToRide', (table) => {
        table.uuid('additionalCostID').notNullable();
        table.uuid('rideID').notNullable();
    
        table.primary(['additionalCostID', 'rideID']);
        table.foreign('additionalCostID').references('additionalCostID').inTable('AdditionalCost').onDelete('CASCADE');
        table.foreign('rideID').references('rideID').inTable('Ride').onDelete('CASCADE');
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTableIfExists('AdditionalCostToRide');
}
