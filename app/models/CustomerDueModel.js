const Model = loadCore('model');

module.exports = class CustomerDueModel extends Model {
    constructor() {
        super();
        this.table = 'customers_due';
        this.primaryKey = 'id';
    }
    async saveCustomerDueData(req_obj) {
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
