const Model = loadCore('model');

module.exports = class ExpectedDueCollectionDatesModel extends Model {
    constructor() {
        super();
        this.table = 'expected_due_collection_dates';
        this.primaryKey = 'id';
    }
    async saveCustomerDueCollectionDate(list_req_obj) {
        try {
            let insertData = await this.db(this.table).insert(list_req_obj);
            let insertedId = insertData[0];
            return insertedId;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
}
