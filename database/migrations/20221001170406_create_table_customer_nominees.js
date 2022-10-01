exports.up = function(knex) {
    return knex.schema.createTable('customer_nominees', function (table) {
       table.increments('id');
       table.string('nominee_name', 255);
       table.string('nominee_address', 255);
       table.string('nominee_phone', 255);
       table.string('relations_with_nominee', 255);
       table.string('image', 255);
       table.string('nominee_nid_no', 255);
       table.string('nominee_email', 255);
       table.string('created_by', 255);
       table.string('updated_by', 255);
       table.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
       table.timestamp('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("customer_nominees");
};