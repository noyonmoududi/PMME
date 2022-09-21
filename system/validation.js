
const db_connection = () => {
  if (process.env.USE_DB == 'true') {
    let { conf_mysql } = require('../config/database');

    let instance = require('knex')({
      client: 'mysql',
      connection: conf_mysql
    });
    instance.raw('select 1+1 as result').catch(err => {
      console.log(`${err}`)
    });
  } else {
    console.log('No database configuration to use')
  }
}

exports.validate = () => {
  db_connection()
}