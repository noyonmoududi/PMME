const Model = loadCore('model');

module.exports = class CustomerNomineeModel extends Model {
    constructor() {
        super();
        this.table = 'customer_nominees';
        this.primaryKey = 'id';
    }
    async saveCustomerNomineeData(req_obj) {
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
