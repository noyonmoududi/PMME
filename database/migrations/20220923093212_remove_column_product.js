exports.up = function(knex) {
    return knex.schema.table('products', function (table) {
        table.dropColumn('company_id');

      })
};

exports.down = function(knex) {
    return knex.schema.table('products', function (table) {
        table.dropColumn('company_id');
    })
};