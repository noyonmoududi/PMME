exports.up = function (knex) {
    return knex.schema.table('sale_info', function (table) {
        table.specificType('invoice_no', 'varchar(255)').unique().alter();
    })
  };
  
  exports.down = function (knex) {
    return knex.schema.table('sale_info', function (table) {
        table.dropColumn('invoice_no').alter();
    })
  };