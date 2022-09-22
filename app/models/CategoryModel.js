const Model = loadCore('model');

module.exports = class CategoryModel extends Model {
    constructor() {
        super();
        this.table = 'categories';
        this.primaryKey = 'id';
    }
}
