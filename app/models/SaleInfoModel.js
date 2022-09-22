const Model = loadCore('model');

module.exports = class SaleInfoModel extends Model {
    constructor() {
        super();
        this.table = 'sale_info';
        this.primaryKey = 'id';
    }
}
