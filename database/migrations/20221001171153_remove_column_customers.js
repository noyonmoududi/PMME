exports.up = function(knex) {
    return knex.schema.table('customers', function (table) {
        table.dropColumn('nominee_name');
        table.dropColumn('nominee_address');
        table.dropColumn('nominee_phone');
        table.dropColumn('relations_with_nominee');

      })
};

exports.down = function(knex) {
    return knex.schema.table('customers', function (table) {
        table.dropColumn('nominee_name');
        table.dropColumn('nominee_address');
        table.dropColumn('nominee_phone');
        table.dropColumn('relations_with_nominee');
    })
};