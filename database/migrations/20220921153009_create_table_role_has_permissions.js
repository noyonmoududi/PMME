
exports.up = function(knex) {
    return knex.schema.createTable('role_has_permissions', function (table) {
        table.specificType('permission_id', 'bigint(19)').notNullable();
        table.specificType('role_id', 'bigint(19)').notNullable();
       table.primary(['permission_id','role_id']);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("role_has_permissions")
};
