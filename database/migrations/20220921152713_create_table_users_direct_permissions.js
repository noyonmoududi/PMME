
exports.up = function(knex) {
    return knex.schema.createTable('user_direct_permissions', function (table) {
       table.specificType('permission_id', 'bigint(19)').unsigned().notNullable();
       table.specificType('user_id', 'bigint(19)').unsigned().notNullable();
       table.primary(['permission_id', 'user_id']);
    })
};
exports.down = function(knex) {
    return knex.schema.dropTable("user_direct_permissions")
};