exports.up = function (knex) {
    return knex.schema.table('reports', function (table) {
        table.string('description'); // Add the description column
    });
};

exports.down = function (knex) {
    return knex.schema.table('reports', function (table) {
        table.dropColumn('description'); // Drop the description column if rolling back
    });
};
