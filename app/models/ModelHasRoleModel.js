const Model = loadCore('model');

module.exports = class ModelHasRoleModel extends Model {
    constructor() {
        super();
        this.table = 'model_has_roles';
    }
}
