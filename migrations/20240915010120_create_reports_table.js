exports.up = function (knex) {
    return knex.schema.createTable('reports', (table) => {
        table.increments('id').primary();
        table.timestamp('time_reported').defaultTo(knex.fn.now());
        table.decimal('longitude', 10, 7);
        table.decimal('latitude', 10, 7);
        table.boolean('is_completed').defaultTo(false);
        table.timestamp('time_completed').nullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('reports');
};
