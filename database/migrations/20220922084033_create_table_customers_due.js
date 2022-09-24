exports.up = function(knex) {
    return knex.schema.createTable('customers_due', function (table) {
       table.increments('id');
       table.specificType('customer_id', 'int').notNullable();
       table.specificType('sale_info_id', 'int').notNullable();
       table.string('invoice_no', 255).notNullable();
       table.specificType('invoice_amount', 'decimal(10,2)').default(0).notNullable();
       table.specificType('due_amount', 'decimal(10,2)').default(0).notNullable();
       table.specificType('remaining_amount', 'decimal(10,2)').default(0).notNullable();
       table.string('installment_duration', 255);
       table.specificType('installment_charge_percentage', 'decimal(10,2)');
       table.specificType('installment_failed_charge_percentage', 'decimal(10,2)');
       table.specificType('is_repayment_completed', 'tinyint(3)').default('0');
       table.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
       table.string('created_by', 255);
       table.timestamp('last_updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
       table.string('last_updated_by', 255);
       table.specificType('is_menual', 'tinyint(3)').default('0');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("customers_due")
};