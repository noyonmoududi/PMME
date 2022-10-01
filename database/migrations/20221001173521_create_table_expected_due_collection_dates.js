exports.up = function(knex) {
    return knex.schema.createTable('expected_due_collection_dates', function (table) {
       table.increments('id');
       table.string('sale_info_id', 255);
       table.specificType('customer_id', 'int');
       table.timestamp('expected_date');
       table.string('created_by', 255);
       table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("expected_due_collection_dates");
};