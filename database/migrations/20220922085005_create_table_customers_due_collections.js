exports.up = function(knex) {
    return knex.schema.createTable('customers_due_collections', function (table) {
       table.increments('id');
       table.specificType('customer_due_id', 'int').notNullable();
       table.string('invoice_no', 255).notNullable();
       table.specificType('amount', 'decimal(10,2)').notNullable();
       table.string('remarks', 255);
       table.string('created_by', 255);
       table.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("customers_due")
};