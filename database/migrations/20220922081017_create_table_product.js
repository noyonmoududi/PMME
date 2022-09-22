exports.up = function(knex) {
    return knex.schema.createTable('products', function (table) {
       table.increments('id');
       table.string('name', 255).notNullable();
       table.string('identity_code', 255).unique().notNullable();
       table.string('image', 255);
       table.specificType('brand_id', 'int').notNullable();
       table.string('description', 255);
       table.specificType('purchase_price', 'decimal(10,2)').notNullable();
       table.specificType('sale_price', 'decimal(10,2)').notNullable();
       table.specificType('company_id', 'int').notNullable();
       table.specificType('category_id', 'int').notNullable();
       table.specificType('status', 'tinyint(3)').default('1');
       table.string('created_by', 255);
       table.string('updated_by', 255);
       table.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
       table.timestamp('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("products")
};