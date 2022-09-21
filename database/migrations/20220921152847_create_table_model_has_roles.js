
exports.up = function(knex) {
    return knex.schema.createTable('model_has_roles', function (table) {
       table.specificType('role_id', 'bigint(19)').unsigned().notNullable();
       table.string('model_type', 255);
       table.specificType('model_id', 'bigint(19)').unsigned().notNullable();
       table.primary(['role_id','model_type', 'model_id']);
    })
};
exports.down = function(knex) {
    return knex.schema.dropTable("model_has_roles")
};