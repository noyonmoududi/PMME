
exports.up = function (knex) {
    return knex.schema.createTable('verify_users', function (table) {
        table.increments('id');
        table.specificType('user_id', 'bigint(20)').notNullable();
        table.string('token', 512).notNullable();
        table.timestamps(true, true);
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable("verify_users")
};
