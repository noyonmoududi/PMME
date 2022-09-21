
exports.up = function(knex) {
    return knex.schema.createTable('password_resets', function (table) {
       table.string('email', 255).notNullable();
       table.string('token', 255).notNullable();
       table.timestamps(true,true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("password_resets")
};
