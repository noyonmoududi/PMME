exports.up = function(knex) {
    return knex.schema.createTable('sale_info', function (table) {
       table.increments('id');
       table.string('invoice_no', 255).notNullable();
       table.timestamp('invoice_date').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
       table.specificType('invoice_item_count', 'int').notNullable();
       table.specificType('net_amount', 'decimal(10,0)').notNullable();
       table.specificType('down_payment', 'decimal(10,0)').notNullable();
       table.specificType('customer_id', 'int').notNullable();
       table.specificType('payment_type_id', 'int').notNullable();
       table.specificType('is_installment', 'tinyint(3)').default('0');
       table.string('created_by', 255);
       table.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("sale_info")
};