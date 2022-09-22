const Model = loadCore('model');

module.exports = class InventoryModel extends Model {
    constructor() {
        super();
        this.table = 'inventory';
        this.primaryKey = 'id';
    }
}
