exports.up = function(knex) {
    return knex.schema.table('products', function (table) {
        table.dropColumn('sale_price');

      })
};

exports.down = function(knex) {
    return knex.schema.table('products', function (table) {
        table.dropColumn('sale_price');
    })
};