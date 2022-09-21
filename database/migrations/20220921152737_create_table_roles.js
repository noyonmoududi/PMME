
exports.up = function(knex) {
    return knex.schema.createTable('roles', function (table) {
       table.increments('id');
       table.string('name', 255).unique().notNullable();
       table.timestamps(true,true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("roles")
};
