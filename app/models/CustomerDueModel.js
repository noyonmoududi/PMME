const Model = loadCore('model');

module.exports = class CustomerDueModel extends Model {
    constructor() {
        super();
        this.table = 'customers_due';
        this.primaryKey = 'id';
    }
}
