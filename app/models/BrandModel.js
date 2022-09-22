const Model = loadCore('model');

module.exports = class BrandModel extends Model {
    constructor() {
        super();
        this.table = 'brands';
        this.primaryKey = 'id';
    }
}
