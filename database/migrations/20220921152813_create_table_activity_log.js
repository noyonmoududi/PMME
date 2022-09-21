
exports.up = function(knex) {
    return knex.schema.createTable('activity_log', function (table) {
       table.increments('id');
       table.string('log_name', 255);
       table.specificType('description', 'text').notNullable();
       table.string('subject_type', 255);
       table.string('subject_id', 255);
       table.string('causer_type', 255);
       table.specificType('causer_id', 'bigint(19)');
       table.specificType('properties', 'text');
       table.string('ip_address', 255);
       table.specificType('user_agent', 'varchar(1023)');
       table.timestamps(true,true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("activity_log")
};
