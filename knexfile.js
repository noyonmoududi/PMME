// Update with your config settings.
let dotEnv = require("dotenv");
let path = require("path");
dotEnv.config();
const { conf_mysql_knex } = require('./config/database')
let knexConfig = {};
knexConfig[process.env.NODE_ENV] = {
    client: 'mysql2',
    connection: conf_mysql_knex,
    migrations: {
        directory: path.join(__dirname, "/database/migrations"),
        tableName: 'migrations'
    },
    seeds: {
        directory: path.join(__dirname, "database/seeds"),
    }
};
module.exports = knexConfig;
