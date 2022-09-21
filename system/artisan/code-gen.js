exports.getControllerCodes = (n) => `const Controller = loadCore('controller');;
module.exports = class ${n} extends Controller {

    constructor() {
        super();
    }
}
`;

exports.getModelCodes = (n, table = "") => `const Model = loadCore('model');

module.exports = class ${n} extends Model {
    constructor() {
        super();
        this.table = '${table}';
        this.primaryKey = 'id';
    }
}
`;
exports.getMiddlewareCodes = () => `module.exports = (req, res, next) => {
    next();
};
`;

exports.getLibraryCodes = () => `module.exports = () => {
    return true;
};
`;

// Get Migration Code start
exports.getMigrationCodes = (table_name, fields = {}) => {
    if (Object.keys(fields).length != 0) {
        let codes = `exports.up = function(knex) {
    return knex.schema.createTable('${table_name || ""}', function (table) {
        table.increments('id');`
        for (let k in fields) {
            let field = fields[k].split(':');
            if (field[1] == 'int') field[1] = 'integer';
            if (field[1] == 'varchar') field[1] = 'string';

            codes += `
        table.${field[1] || 'string'}('${field[0]}').nullable();`
        }

        codes += `
        table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('${table_name || ""}')
};
`
        return codes;
    } else {
        return `
exports.up = function(knex) {
    return knex.schema.createTable('${table_name || ""}', function (table) {
       table.increments('id');
       
       table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
       table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('${table_name || ""}')
};
`
    }
}
// Get Migration Code End