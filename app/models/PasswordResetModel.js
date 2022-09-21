const Model = loadCore('model');

module.exports = class PasswordResetModel extends Model {
    constructor() {
        super();
        this.table = 'password_resets';
    }
}
