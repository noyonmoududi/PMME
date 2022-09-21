exports.getControllerCodes = (n) => `const Controller = require('./Controller');
module.exports = class ${n} extends Controller {

    constructor() {
        super();
    }
}
`;

exports.getModelCodes = (n) => `const Model = loadCore('model');

module.exports = class ${n} extends Model {
    constructor() {
        super();
        this.table = '';
        this.primaryKey = '';
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