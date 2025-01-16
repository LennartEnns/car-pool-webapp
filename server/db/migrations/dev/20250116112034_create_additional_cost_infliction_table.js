/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('AdditionalCostInfliction', (table) => {
        table.uuid('additionalCostInflictionID').primary().defaultTo(knex.fn.uuid());
        table.uuid('userID').notNullable();
        table.uuid('additionalCostID').notNullable();
        table.uuid('rideID').nullable();
        table.decimal('derivedAmount', 10, 2).notNullable();
        table.dateTime('inflictionDatetime').notNullable().defaultTo(knex.fn.now());
    
        table.foreign('userID').references('userID').inTable('User').onDelete('CASCADE');
        table.foreign('additionalCostID').references('additionalCostID').inTable('AdditionalCost').onDelete('CASCADE');
        table.foreign('rideID').references('rideID').inTable('Ride').onDelete('CASCADE');
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTableIfExists('AdditionalCostInfliction');
}
