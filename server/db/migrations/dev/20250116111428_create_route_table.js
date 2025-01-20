/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('Route', (table) => {
        table.uuid('routeID').primary().defaultTo(knex.fn.uuid());
        table.uuid('userID').notNullable();
        table.uuid('vehicleID').notNullable();
        table.string('description', 255).notNullable();
        table.decimal('distance', 10, 2).notNullable().comment('In kilometers');
        table.string('location1', 60).notNullable();
        table.string('location2', 60).notNullable();
        table.boolean('defaultBothWays').notNullable().comment('1 for both ways, 0 for one way');
        table.date('validFrom').notNullable();
        table.date('validTo').notNullable();
        table.binary('schedule', 1).nullable().comment('e.g., 01111100 for weekdays. First bit should be 0.');
        table.string('currencyCode', 3).notNullable();
        table.decimal('relativeFuelCost', 10, 2).notNullable().defaultTo(0.0).comment('Fuel cost amount per l or per kWh');
        table.decimal('customConsumption', 10, 2).nullable();
    
        table.foreign('currencyCode').references('currencyCode').inTable('Currency').onDelete('NO ACTION');
        table.foreign('userID').references('userID').inTable('User').onDelete('CASCADE');
        table.foreign('vehicleID').references('vehicleID').inTable('Vehicle').onDelete('SET NULL');
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTableIfExists('Route');
}
