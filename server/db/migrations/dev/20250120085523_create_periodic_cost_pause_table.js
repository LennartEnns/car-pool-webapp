/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('PeriodicCostPause', (table) => {
        table.uuid('costFactorID').notNullable();
        table.date('pauseUntil').notNullable();

        table.foreign('costFactorID').references('costFactorID').inTable('costFactor').onDelete('CASCADE');
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTableIfExists('PeriodicCostPause');
}
