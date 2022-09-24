const Model = loadCore('model');

module.exports = class PaymentTypeModel extends Model {
    constructor() {
        super();
        this.table = 'payment_type';
        this.primaryKey = 'id';
    }
    async getAllpayment() {
        try {
            let rows =await this.db(this.table).where({status:1}).select();
            return rows;
        }
        catch (error) {
            return Promise.reject(error);
        }
    } 
}
