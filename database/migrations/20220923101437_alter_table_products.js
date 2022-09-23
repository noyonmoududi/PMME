exports.up = function (knex) {
    return knex.schema.table('products', function (table) {
        table.specificType('description', 'text').alter();
    })
  };
  
  exports.down = function (knex) {
    return knex.schema.table('products', function (table) {
        table.dropColumn('description').alter();
    })
  };