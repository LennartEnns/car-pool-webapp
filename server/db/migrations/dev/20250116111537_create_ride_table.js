/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('Ride', (table) => {
        table.uuid('rideID').primary().defaultTo(knex.fn.uuid());
        table.uuid('routeID').notNullable();
        table.dateTime('startDatetime').nullable();
        table.dateTime('arrivalDatetime').notNullable();
        table.decimal('customDistance', 10, 2).nullable();
        table.boolean('customBothWays').nullable();
        table.boolean('reverseDirection').notNullable().defaultTo(false);
    
        table.foreign('routeID').references('routeID').inTable('Route').onDelete('CASCADE');
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTableIfExists('Ride');
}
