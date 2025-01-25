/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('CostFactor', (table) => {
        table.uuid('costFactorID').primary().defaultTo(knex.fn.uuid());
        table.uuid('routeID').nullable();
        table.string('name', 40).notNullable().defaultTo('').comment('e.g., "Parking"');
        table.string('period', 1).notNullable().comment('e.g., "m" for monthly, "r" for ride, "k" for kilometers');
        table.smallint('periodMultiplier').notNullable().defaultTo(1);
        table.string('inflictionMode', 1).notNullable().comment('e.g., "d" for "distribute equally", "e" for "inflict on every user"');
        table.decimal('amount', 10, 2).notNullable();
    
        table.foreign('routeID').references('routeID').inTable('Route').onDelete('CASCADE');
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTableIfExists('CostFactor');
}
