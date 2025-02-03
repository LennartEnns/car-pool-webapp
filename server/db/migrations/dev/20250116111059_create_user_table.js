// import { userLimits } from '../../../../limits';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('User', (table) => {
        table.uuid('userID').primary().defaultTo(knex.fn.uuid());
        table.string('username', 20).unique().notNullable;
        table.string('realName', 50).nullable();
        table.string('pwHash', 60).notNullable();
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTableIfExists('User');
}
