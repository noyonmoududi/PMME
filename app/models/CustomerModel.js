const Model = loadCore('model');

module.exports = class CustomerModel extends Model {
    constructor() {
        super();
        this.table = 'customers';
        this.primaryKey = 'id';
    }
}
