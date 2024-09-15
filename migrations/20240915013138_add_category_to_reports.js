exports.up = function (knex) {
    return knex.schema.table('reports', function (table) {
        table.string('category').notNullable().defaultTo('Unknown');
    });
};

exports.down = function (knex) {
    return knex.schema.table('reports', function (table) {
        table.dropColumn('category');
    });
};
