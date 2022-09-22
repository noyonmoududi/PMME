const Model = loadCore('model');

module.exports = class CompanyModel extends Model {
    constructor() {
        super();
        this.table = 'company';
        this.primaryKey = 'id';
    }
}
