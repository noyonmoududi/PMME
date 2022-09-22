const Model = loadCore('model');

module.exports = class ProductModel extends Model {
    constructor() {
        super();
        this.table = 'products';
        this.primaryKey = 'id';
    }
}
