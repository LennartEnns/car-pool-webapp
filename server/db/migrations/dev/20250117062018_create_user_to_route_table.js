/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('UserToRoute', (table) => {
        table.uuid('userID').notNullable();
        table.uuid('routeID').notNullable();
        table.boolean('bothWays').notNullable();
    
        table.primary(['userID', 'routeID']);
        table.foreign('userID').references('userID').inTable('User').onDelete('CASCADE');
        table.foreign('routeID').references('routeID').inTable('Route').onDelete('CASCADE');
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTableIfExists('UserToRoute');
}
