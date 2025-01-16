/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('Currency', (table) => {
        table.string('currencyCode', 3).primary().comment('ISO 4217 currency code (e.g., USD, EUR)');
        table.string('currencySymbol', 1).notNullable().comment("'€' for EUR, '$' for USD etc.");
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTableIfExists('Currency');
}
