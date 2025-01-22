/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('Vehicle', (table) => {
        table.uuid('vehicleID').primary().defaultTo(knex.fn.uuid());
        table.uuid('userID').notNullable();
        table.string('name', 40).notNullable();
        table.string('model', 40).notNullable().defaultTo('');
        table.string('description', 255).notNullable().defaultTo('');
        table.decimal('consumption', 10, 2).notNullable().comment('Fuel consumption in liters/100km or kWh/100km');
        table.boolean('electric').notNullable().comment('1 for electric, 0 for non-electric');
        table.foreign('userID').references('userID').inTable('User').onDelete('CASCADE');
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTableIfExists('Vehicle');
}
