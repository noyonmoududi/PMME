
exports.up = function(knex) {
    return knex.schema.createTable('permissions', function (table) {
       table.increments('id');
       table.string('name', 255).notNullable();
       table.string('guard_name', 255).notNullable();
       table.timestamps(true,true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("permissions")
};
