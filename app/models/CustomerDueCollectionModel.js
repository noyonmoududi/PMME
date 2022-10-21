const Model = loadCore('model');

module.exports = class CustomerDueCollectionModel extends Model {
    constructor() {
        super();
        this.table = 'customers_due_collections';
        this.primaryKey = 'id';
    }

    async dueCollectionAmountSave(req_obj) {
        try {
            let insertData = await this.db(this.table).insert({ ...req_obj });
            let insertedId = insertData[0];
            return insertedId;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
}
