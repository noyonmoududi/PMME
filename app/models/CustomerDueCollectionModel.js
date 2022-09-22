const Model = loadCore('model');

module.exports = class CustomerDueCollectionModel extends Model {
    constructor() {
        super();
        this.table = 'customers_due_collections';
        this.primaryKey = 'id';
    }
}
