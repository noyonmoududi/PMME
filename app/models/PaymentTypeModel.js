const Model = loadCore('model');

module.exports = class PaymentTypeModel extends Model {
    constructor() {
        super();
        this.table = 'payment_type';
        this.primaryKey = 'id';
    }
}
