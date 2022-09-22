exports.up = function(knex) {
    return knex.schema.createTable('sale_item', function (table) {
       table.increments('id');
       table.specificType('sale_info_id', 'int').notNullable();
       table.specificType('product_id', 'int').notNullable();
       table.string('identity_code', 255).notNullable();
       table.specificType('quantity', 'bigint').notNullable();
       table.specificType('sale_price', 'decimal(10,2)').notNullable();
       table.specificType('sale_amount', 'decimal(10,2)').notNullable();
       table.specificType('salesman_id', 'int');
       table.string('created_by', 255);
       table.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("sale_item")
};