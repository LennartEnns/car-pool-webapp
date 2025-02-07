/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('CostInfliction', (table) => {
        table.uuid('costInflictionID').primary().defaultTo(knex.fn.uuid());
        table.uuid('userID').notNullable();
        table.uuid('costFactorID').notNullable();
        table.uuid('rideID').nullable();
        table.decimal('derivedAmount', 10, 2).notNullable();
        table.string('costStatus', 3).notNullable().defaultTo('pnd');
        table.dateTime('inflictionDatetime').notNullable().defaultTo(knex.fn.now());
    
        table.foreign('userID').references('userID').inTable('User').onDelete('CASCADE');
        table.foreign('costFactorID').references('costFactorID').inTable('CostFactor').onDelete('CASCADE');
        table.foreign('rideID').references('rideID').inTable('Ride').onDelete('CASCADE');
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTableIfExists('CostInfliction');
}
