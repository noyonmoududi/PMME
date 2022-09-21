const Model = loadCore('model');

module.exports = class RoleHasPermissionModel extends Model {
    constructor() {
        super();
        this.table = 'role_has_permissions';
    }
}
