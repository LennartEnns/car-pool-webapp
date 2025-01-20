/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('PeriodicCostPause', (table) => {
        table.uuid('additionalCostID').notNullable();
        table.date('pauseUntil').notNullable();

        table.foreign('additionalCostID').references('additionalCostID').inTable('additionalCost').onDelete('CASCADE');
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTableIfExists('PeriodicCostPause');
}
