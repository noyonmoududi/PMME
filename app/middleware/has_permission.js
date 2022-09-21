

module.exports = function (permission, type = 'OR') {
    let PermissionModel = loadModel('PermissionModel');
    let RoleModel = loadModel('RoleModel');
    let RoleHasPermissionModel = loadModel('RoleHasPermissionModel');
    let UserDirectPermissionModel = loadModel('UserDirectPermissionModel');
    let ModelHasRoleModel = loadModel('ModelHasRoleModel');
   
    return async function (req, res, next) {
        try {
            let permissionDataArr =[];
            if (req.session.user) {
                 //Save and update in Single method thats why parmission array passing
                for (let i = 0; i < permission.length; i++) {
                    const element = permission[i];
                    let permissionData = await PermissionModel.db(PermissionModel.table).where({name:element}).select().first();
                    permissionDataArr.push(permissionData);
                }
                
                // if user logged in
                let hasPermission = false;
                //user_role = req.session.user.role; // get user role

                let user_roles = await ModelHasRoleModel.db(ModelHasRoleModel.table)
                .leftJoin(RoleModel.table,RoleModel.table+'.id','=',ModelHasRoleModel.table+'.role_id')
                .where(ModelHasRoleModel.table+'.model_id',req.session.user.id).select([
                    RoleModel.table+'.name as roleName',
                    RoleModel.table+'.id as roleId'
                ]).select();

                if (permissionDataArr.length > 0) {
                    for (let j = 0; j < permissionDataArr.length; j++) {
                        const element2 = permissionDataArr[j];
                        //direct Permission check
                        let userDirectParmission = await UserDirectPermissionModel.db(UserDirectPermissionModel.table)
                        .where(UserDirectPermissionModel.table+'.permission_id',element2.id).andWhere(UserDirectPermissionModel.table+'.user_id',req.session.user.id).select().first();
                        if (userDirectParmission) {
                            hasPermission=true;
                            break;
                        }

                        //Role Wise Permission check.Users should be multiple roles..thats why using Forloop
                        for (let i = 0; i < user_roles.length; i++) {
                            const roleId = user_roles[i].roleId;
                            let roleHasParmission = await RoleHasPermissionModel.db(RoleHasPermissionModel.table).where({permission_id:element2.id,role_id:roleId}).select().first();
                            if (roleHasParmission) {
                                hasPermission =true;
                                break;
                            }
                        }
                    }
                }
                if (hasPermission) next();
                else {
                    if (isApiCall(req)) {
                        return res.send({
                            'error': 1,
                            'error_code': 'PERMISSION_DENIED',
                            'message': "You're not authorized to do this action"
                        });
                    }
                    req.session.flash_toastr_error = "You're not authorized to do this action";
                    res.redirect(`${req.baseUrl}/dashboard`)
                }
            } else {
                // if not logged in
                delete req.session.permissions;
                delete req.session.user;
                if (isApiCall(req)) {

                    return res.send({
                        'error': 1,
                        'error_code': 'AUTH_FAILED',
                        'message': 'Authentication required'
                    });
                }
                return res.redirect(`${req.baseUrl}/login`);
            }
        }
        catch (err) {
            console.log(err)
            delete req.session.permissions;
            delete req.session.user;
            if (isApiCall(req)) {

                return res.send({
                    'error': 1,
                    'error_code': 'Something Went Wrong',
                    'message': "Something went wrong. Please check system log"
                });
            }
            req.session.flash_toastr_error = "Something went wrong";
            //res.redirect('/dashboard')
            return res.redirect(`${req.baseUrl}/login`);
        }
    }
}