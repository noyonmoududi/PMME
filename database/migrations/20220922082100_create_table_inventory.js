exports.up = function(knex) {
    return knex.schema.createTable('inventory', function (table) {
       table.increments('id');
       table.specificType('product_id', 'int').notNullable();
       table.string('identity_code', 255).notNullable();
       table.specificType('quantity', 'bigint').notNullable();
       table.string('created_by', 255);
       table.string('updated_by', 255);
       table.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
       table.timestamp('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("inventory")
};