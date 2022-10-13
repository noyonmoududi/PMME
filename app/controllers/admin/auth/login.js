const Controller = require('../../Controller');


module.exports = class user extends Controller {

    constructor() {
        super();
    }

   async login(Req, Res) {
        let data = {
            Request: Req,
            errors: Req.flash('errors')[0],
            old: Req.flash('old')[0],
        }
        if (Req.session.user && Req.session.user.type =='Admin') {
            return Res.redirect(`/admin/dashboard`);
        }
        Res.render('admin/auth/login', data);
    }

    async attemptLogin(Req, Res) {
        let ActivityLogModel = loadModel('ActivityLogModel');
        let RequestData = loadValidator(Req, Res);
        let email = RequestData.post('email', true).val();
        let password = RequestData.post('password', true).val();

        let UserModel = loadModel('UserModel');
        //let Recaptcha = loadLibrary('recaptchaverify');
       // let recaptcha = new Recaptcha();
       // let verifyResult = await recaptcha.verify(Req,Res);
        //if (verifyResult.success == true || process.env.NODE_ENV == "development") {
            if (!RequestData.validate()) return false;
            UserModel.attemptLogin(email, password, Req, Res).then(async(res) => {
                //Req.session.flash_toastr_success = `You are successfully logged in`;
                    await ActivityLogModel.saveLogData(Req,Res,'has logged in','users',Req.session.user.id);
                    Req.session.permissions = await userActionPermissions(Req);
                    return Res.redirect(`/admin/dashboard`);
               
            }).catch(err => {
                errorLog(Req,Res,err);
                Req.session.flash_error_msg = err.data.message;
                console.log(err);
                return back(Req, Res);
            })
        // } else {
        //    // Req.session.flash_toastr_error = 'Recaptcha Verify Failed!';
        //     return Res.redirect(`/admin/login`);
        // }
    }

    async logout(Req, Res) {
        let ActivityLogModel = loadModel('ActivityLogModel');
        await ActivityLogModel.saveLogData(Req,Res,'has Logged Out','users',Req.session.user.id);
        delete Req.session.user;
        delete Req.session.permissions;
        delete Req.session.sale_invoice_num;
        Res.redirect(`/admin/login`);
    }

    register(Req, Res) {
        let data = {
            Request: Req,
            errors: Req.flash('errors')[0],
            old: Req.flash('old')[0]
        }
        Res.render('pages/auth/register', data);
    }

    registerSubmit(Req, Res) {
        const bcrypt = require('bcryptjs');
        let RequestData = loadValidator(Req, Res);
        let req_data = {
            first_name: RequestData.post('first_name', true, 'First Name').val(),
            last_name: RequestData.post('last_name', true, 'Last Name').val(),
            email: RequestData.post('email', true, 'E-mail').type('email').val(),
            password: RequestData.post('password', true, 'Password').sameAs('confirm_password').val(),
        };

        if (RequestData.validate()) {
            let UserModel = loadModel('UserModel');
            req_data.password = bcrypt.hashSync(req_data.password, 10);
            UserModel.db(UserModel.table).insert(req_data).then(res => {
                Req.session.flash_success_msg = 'Registration complete successfully';
                Res.redirect(`/login`);
            }).catch(err => {
                errorLog(Req,Res,err);
                Res.send(err)
            })
        }
    }
    updatePassword(Req, Res) {
        let data = {
            Request: Req,
            errors: Req.flash('errors')[0],
            old: Req.flash('old')[0]
        }
        Res.render('pages/auth/change_password', data);
    }
    async updatePasswordSubmit(Req, Res) {
        let RequestData = loadValidator(Req, Res);
        let user_id = Req.session.user.id;
        let old_password = RequestData.post('old_password', true).val()
        let password = RequestData.post('password', true).sameAs('confirm_password').val()
        if (!RequestData.validate()) return false;

        let UserModel = loadModel('UserModel');
        try {
            let { is_valid, message } = await UserModel.passwordIsValid(user_id, old_password)
            if (is_valid) {
                let res = await UserModel.UpatePassword(user_id, password)
                console.log(res)
                Req.session.flash_success_msg = 'Password has been updated';
            } else {
                Req.session.flash_error_msg = message || "Old Password didn't match";
            }
            return back(Req, Res)
        } catch (err) {
            errorLog(Req,Res,err);
            console.log(err)
            Req.session.flash_error_msg = 'Something went wrong';
            return back(Req, Res);
        }
    }

    resetPassword(Req, Res) {
        let data = {
            Request: Req,
        }
        data.page_title = 'Forget password reset';
        Res.render('pages/auth/reset_password', data);

    }

    resetPasswordSubmit(Req, Res) {
        let data = {
            Request: Req
        }
        let RequestData = loadValidator(Req, Res);
        let email = RequestData.post('email', true).value;

        let UserModel = loadModel('UserModel');
        UserModel.addResetLink(Req, email).then(res => {
            data.page_title = 'Success! Password reset link'
            data.reset_message = res.message;
            Res.render('pages/auth/reset_success', data);
        }).catch(err => {
            errorLog(Req,Res,err);
            console.log(err);
            return back(Req, Res);
        })
    }
}

async function userActionPermissions(Req) {
    let PermissionModel = loadModel('PermissionModel');
    let RoleModel = loadModel('RoleModel');
    let RoleHasPermissionModel = loadModel('RoleHasPermissionModel');
    let UserDirectPermissionModel = loadModel('UserDirectPermissionModel');
    let ModelHasRoleModel = loadModel('ModelHasRoleModel');
    let permissionsList=[];
    let userId = Req.session.user.id; 
    let user_roles = await ModelHasRoleModel.db(ModelHasRoleModel.table)
                    .leftJoin(RoleModel.table,RoleModel.table+'.id','=',ModelHasRoleModel.table+'.role_id')
                    .where(ModelHasRoleModel.table+'.model_id',userId).select([
                        RoleModel.table+'.name as roleName',
                        RoleModel.table+'.id as roleId'
                    ]).select();
    for (let i = 0; i < user_roles.length; i++) {
        const roleId = user_roles[i].roleId;
        let roleHasParmission = await RoleHasPermissionModel.db(RoleHasPermissionModel.table)
                                .leftJoin(PermissionModel.table,PermissionModel.table+'.id','=',RoleHasPermissionModel.table+'.permission_id')
                                .where({role_id:roleId}).select([
                                        PermissionModel.table+'.id',
                                        PermissionModel.table+'.name'
        ]);
        permissionsList.push.apply(permissionsList, roleHasParmission);//list element value push in another list
    }
    let userDirectParmission = await UserDirectPermissionModel.db(UserDirectPermissionModel.table)
                                .leftJoin(PermissionModel.table,PermissionModel.table+'.id','=',UserDirectPermissionModel.table+'.permission_id')
                                .where(UserDirectPermissionModel.table+'.user_id',userId).select(
                                    [
                                        PermissionModel.table+'.id',
                                        PermissionModel.table+'.name'
                                ]);
    if (userDirectParmission) {
        permissionsList.push.apply(permissionsList, userDirectParmission);
    }
    var result = permissionsList.reduce((unique, o) => {
        if(!unique.some(obj => obj.id === o.id && obj.name === o.name)) {
          unique.push(o);
        }
        return unique;
    },[]);
    return result;
}


