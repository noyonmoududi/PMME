
exports.up = function(knex) {
    return knex.schema.createTable('users', function (table) {
       table.increments('id');
       table.string('name', 255).notNullable();
       table.string('photo', 255);
       table.string('phone', 255).unique().notNullable();
       table.string('email', 255).unique().notNullable();
       table.string('password', 255).notNullable();
       table.string('address', 255);
       table.specificType('status', 'tinyint(3)').default('1');
       table.specificType('pw_changed', 'tinyint(3)').default('0');
       table.specificType('shop_id', 'int');
       table.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
       table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("users")
};
