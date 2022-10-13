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

    async getCustomerNomineeInfoByPhone(phone) {
        try {
            let result = await this.db(this.table).where({nominee_phone:phone}).select().first();
            return result;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async getCustomerNomineeInfoByid(id) {
        try {
            let result = await this.db(this.table).where({id}).select().first();
            return result;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
}
