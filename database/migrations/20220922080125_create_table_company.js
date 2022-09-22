
exports.up = function(knex) {
    return knex.schema.createTable('company', function (table) {
       table.increments('id');
       table.string('name', 255).notNullable();
       table.string('address', 255);
       table.string('phone', 255).notNullable();
       table.string('email', 255);
       table.specificType('status', 'tinyint(3)').default('1');
       table.string('created_by', 255);
       table.string('updated_by', 255);
       table.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
       table.timestamp('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("company")
};