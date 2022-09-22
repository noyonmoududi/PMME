const Model = loadCore('model');

module.exports = class SaleItemModel extends Model {
    constructor() {
        super();
        this.table = 'sale_item';
        this.primaryKey = 'id';
    }
}
