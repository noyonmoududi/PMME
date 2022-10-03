const Model = loadCore('model');

module.exports = class CustomerModel extends Model {
    constructor() {
        super();
        this.table = 'customers';
        this.primaryKey = 'id';
    }
    async saveCustomerData(req_obj) {
        try {
            let insertData = await this.db(this.table).insert({ ...req_obj });
            let insertedId = insertData[0];
            return insertedId;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async getCustomerInfoByPhone(phone) {
        try {
            let result = await this.db(this.table).where({phone}).select().first();
            return result;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
}
