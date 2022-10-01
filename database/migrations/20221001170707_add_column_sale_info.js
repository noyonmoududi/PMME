exports.up = function (knex) {
    return knex.schema.table('sale_info', function (table) {
      table.specificType('customer_nominee_id', 'int');
    })
  };
  
  exports.down = function (knex) {
    return knex.schema.table('sale_info', function (table) {
      table.dropColumn('customer_nominee_id');
    })
  };