
exports.up = function(knex) {
    return knex.schema.createTable('categories', function (table) {
       table.increments('id');
       table.string('name', 255).notNullable();
       table.specificType('status', 'tinyint(3)').default('1');
       table.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
       table.timestamp('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("categories")
};