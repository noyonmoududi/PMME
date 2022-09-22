const Model = loadCore('model');

module.exports = class ShopModel extends Model {
    constructor() {
        super();
        this.table = 'shop';
        this.primaryKey = 'id';
    }
}
