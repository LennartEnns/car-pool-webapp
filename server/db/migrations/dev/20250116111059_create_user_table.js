/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('User', (table) => {
        table.uuid('userID').primary().defaultTo(knex.fn.uuid());
        table.string('username', 50).unique().notNullable;
        table.string('name', 50).nullable();
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTableIfExists('User');
}
