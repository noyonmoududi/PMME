/*
 @Purpose: Database setting information
*/

/*
 @Purpose: use driver name like mysql or false without database
*/

const configurations = {
  host: (process.env.DB_HOST) ? process.env.DB_HOST : '127.0.0.1',
  user: (process.env.DB_USER) ? process.env.DB_USER : '',
  password: (process.env.DB_PASSWORD) ? process.env.DB_PASSWORD : '',
  database: (process.env.DB_NAME) ? process.env.DB_NAME : ''
}
const conf_mysql = {
  ...configurations,
  timezone: 'UTC',
  typeCast: function (field, next) {
    if (field.type == 'DATETIME' || field.type == 'TIMESTAMP') {
      let value = field.string();
      if (!value) return value;
      if (Config.db_datetime_convert) return moment(value).tz(Config.timezone).format('YYYY-MM-DD HH:mm:ss');
      else return moment(value).format('YYYY-MM-DD HH:mm:ss');
    } else if (field.type == 'DATE') {
      let value = field.string();
      if (!value) return value;
      if (Config.db_datetime_convert) return moment(value).tz(Config.timezone).format('YYYY-MM-DD');
      else return moment(value).format('YYYY-MM-DD');
    }
    return next();
  }
};
exports.conf_mysql = conf_mysql;
exports.conf_mysql_knex = configurations;
if (process.env.USE_DB == 'true') {
  let instance = require('knex')({
    client: 'mysql',
    connection: conf_mysql
  });
  exports.instance = instance;
}