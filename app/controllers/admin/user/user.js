const Controller = require('../../Controller');

module.exports = class UserModel extends Controller {

    constructor() {
        super();
    }

    async userList(Req, Res) {

        try{
            let {page,search,sort,status,limit} = Req.query;
            limit =limit || 10;
            let page_no = (page)?parseInt(page):1;
            let offset = (page_no-1)*limit;
            offset = (offset<0)?0:offset;

            let UserModel = loadModel('UserModel');

            let query_builder = UserModel.db.from(UserModel.table);

            if(search) query_builder.where((query)=>{
                query.where('name','like',`%${search}%`)
                query.orWhere('email','like',`%${search}%`)
                query.orWhere('type','like',`%${search}%`)
                query.orWhere('status','like',`%${search}%`)
            });
            if (sort) {
                if (sort == 1) query_builder.orderBy(UserModel.table + '.name', 'asc')
                else if (sort == 2) query_builder.orderBy(UserModel.table + '.name', 'desc')
                else if (sort == 3) query_builder.orderBy(UserModel.table + '.email', 'asc')
                else if (sort == 4) query_builder.orderBy(UserModel.table + '.email', 'desc')
                else if (sort == 5) query_builder.orderBy(UserModel.table + '.created_at', 'asc')
                else if (sort == 6) query_builder.orderBy(UserModel.table + '.created_at', 'desc')
                else query_builder.orderBy(UserModel.table + '.id', 'desc')
            } else query_builder.orderBy(UserModel.table + '.id', 'desc')

            if (status) {
                query_builder.where(UserModel.table + '.status', parseInt(status) ? 1 : 0)
            }

            let qb = query_builder.clone();
            let rows = await query_builder.limit(limit)
                        .offset(offset)
                        //.orderBy(UserModel.table+'.id','desc')
                        //.select(UserModel.db.raw('count('+UserModel.table+'.id) OVER() as total'))
                        .select([
                            UserModel.table+'.*'
                        ]);
            let total_rows = await qb.count(UserModel.table + ".id", { as: 'total' }).first();
            let search_panel = {
                active:true,
                limit:true,
                data: {
                    sort: {
                        1: 'Name - Ascending',
                        2: 'Name - Descending',
                        3: 'Email - Ascending',
                        4: 'Email - Descending',
                        5: 'Created At - Ascending',
                        6: 'Created At - Descending',
                    },
                    status: { 0: 'InActive', 1: 'Active', }
                }
            }
            let data = {
                Request : Req,
                rows,
                sl:offset+1,
                search_panel
            }
            let total = total_rows.total || 0;
            let Pagination = loadLibrary('pagination');
            let pagination = new Pagination(total,page_no,'/admin/users',limit,Req.query);
            data.pagination = pagination.links();
            Res.render('admin/user/user_list', data);
        }catch(err){
            errorLog(Req,Res,err);
            console.log(err)
            Res.render('errors/500',{Request:Req});
        }
    }
    async userCreate(Req, Res) {
        let data = {
            Request: Req,
            errors: Req.flash('errors')[0],
            old: Req.flash('old')[0]
        }
        let RoleModel = loadModel('RoleModel');
        let roles = await RoleModel.db(RoleModel.table).select();
        data.roleData = roles;
        Res.render('admin/user/create',data);
    }
    async userDetails(Req, Res) {
        let data = {
            Request: Req,
            errors: Req.flash('errors')[0],
            old: Req.flash('old')[0]
        }
        let id = Req.params["id"];
        let UserModel = loadModel('UserModel');
        let rowdata = await UserModel.db(UserModel.table).where({id}).first();
        data.userData = rowdata;
        Res.render('admin/user/user_details',data);
    }
    async userSave(Req,Res){
        let ActivityLogModel = loadModel('ActivityLogModel');
        const bcrypt = require('bcryptjs');
        try {
            let RequestData = loadValidator(Req, Res);
            var roleId = RequestData.post('role', true, 'Role').val();
            let req_data = {
                name: RequestData.post('name', true, 'Name').val(),
                email: RequestData.post('email', true, 'E-mail').type('email').val(),
                phone: RequestData.post('phone', false, 'Phone').val(),
                created_at:new Date(),
                updated_at:new Date(),
                type: 'Admin'
            };

            if (!RequestData.validate()) return false;
             let UserModel = loadModel('UserModel');
             let ModelHasRoleModel = loadModel('ModelHasRoleModel');
            let existRow = await UserModel.db(UserModel.table).where({email:req_data.email}).first();
            if (typeof(existRow) === "undefined"){
                let random = require("randomstring");
                let teamPassword = random.generate(8);
                req_data.password = bcrypt.hashSync(teamPassword, 10);
                let userSave = await UserModel.db(UserModel.table).insert({...req_data});
                if (userSave) {
                    let req_role ={
                        role_id: parseInt(roleId),
                        model_type:"AppUser",
                        model_id: parseInt(userSave),
                    }
                    let saveRole = await ModelHasRoleModel.db(ModelHasRoleModel.table).insert(req_role);
                    let sendMail = await sendMailForUserAccountCreate(req_data.name,req_data.email,teamPassword,Req);
                    await ActivityLogModel.saveLogData(Req,Res,'User has been created by',UserModel.table,userSave);
                }
            } else{
                if (existRow.email == req_data.email) {
                    Req.session.flash_toastr_error = 'Email already Exist!.';
                }
                return back(Req, Res);
            }            
            Req.session.flash_toastr_success = 'User Created successfully!';
            // return back(Req, Res);
            Res.redirect(`/admin/users`);

        } catch (err) {
            errorLog(Req,Res,err);
            console.log(err)
            Req.session.flash_toastr_error = 'Something Went Wrong';
            return back(Req, Res);
        }
    }
    async userDataEdit(Req,Res){
        let ActivityLogModel = loadModel('ActivityLogModel');
        try {
            let RequestData = loadValidator(Req, Res);
            var hidden_id = RequestData.post('hidden_id', false, 'hidden_id').val();
            let req_data = {
                name: RequestData.post('name', true, 'Name').val(),
                email: RequestData.post('email', true, 'E-mail').type('email').val(),
                phone: RequestData.post('phone', false, 'Phone').val(),
                updated_at:new Date(),
            };

            if (!RequestData.validate()) return false;
             let UserModel = loadModel('UserModel');
            let existRow = await UserModel.db(UserModel.table).where({email:req_data.email}).first();
            if (typeof(existRow) === "undefined" || existRow.id ==hidden_id){
                let update = await UserModel.db(UserModel.table).where({id:hidden_id}).update(req_data);
                await ActivityLogModel.saveLogData(Req,Res,'User has been updated by',UserModel.table,hidden_id);
            } else{
                if (existRow.email == req_data.email) {
                    Req.session.flash_toastr_error = 'Email already Exist!.';
                }
                return back(Req, Res);
            }            
            Req.session.flash_toastr_success = 'User Updated successfully!';
            // return back(Req, Res);
            Res.redirect(`/admin/users`);

        } catch (err) {
            errorLog(Req,Res,err);
            console.log(err)
            Req.session.flash_toastr_error = 'Something Went Wrong';
            return back(Req, Res);
        }
    }
    async userEdit(Req, Res) {
        let data = {
            Request: Req,
            errors: Req.flash('errors')[0],
            old: Req.flash('old')[0]
        }
        let user_id = Req.params["id"];
        let RoleModel = loadModel('RoleModel');
        let UserModel = loadModel('UserModel');
        let roles = await RoleModel.db(RoleModel.table).select();
        let user = await UserModel.db(UserModel.table).where({id:user_id}).select(['id','name','phone','email']).first();
        data.old = user;
        data.roleData = roles;
        Res.render('admin/user/user_edit',data);
    }
    async deleteUser(Req,Res){
        let ActivityLogModel = loadModel('ActivityLogModel');
        try {
            let id = Req.params["id"];
            if (id) {
                let UserModel = loadModel('UserModel');
                let result = await UserModel.db(UserModel.table).where({id}).update({status:0});
                Req.session.flash_toastr_success = 'User Deleted successfully!';
                await ActivityLogModel.saveLogData(Req,Res,'User has been deleted by',UserModel.table,id);
            }else{
                Req.session.flash_toastr_error = 'Data Not Found!.';
            }
            Res.redirect(`/admin/users`);
        } catch (error) {
            errorLog(Req,Res,error);
            Req.session.flash_toastr_error = 'Something Went wrong!..';
            Res.redirect(`/admin/users`);
        }
    }

}

async function sendMailForUserAccountCreate(name, email,tempPass,Req) {
    const mailer = loadLibrary('mailer');
    // const SendMail = loadLibrary('sendMail');
    // let sendMail = new SendMail();
    let output = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                    <html xmlns="http://www.w3.org/1999/xhtml">
                    <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                        <title>Welcome Email</title>
                    </head>
                    <body style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; -webkit-text-size-adjust: none; background-color: #ffffff; color: #718096; height: 100%; line-height: 1.4; margin: 0; padding: 0; width: 100% !important;">
                    <style>
                        @media  only screen and (max-width: 600px) {
                            .inner-body {
                                width: 100% !important;
                            }
                    
                            .footer {
                                width: 100% !important;
                            }
                        }
                    
                        @media  only screen and (max-width: 500px) {
                            .button {
                                width: 100% !important;
                            }
                        }
                    </style>
                    
                    <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation"
                            style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; -premailer-cellpadding: 0; -premailer-cellspacing: 0; -premailer-width: 100%; background-color: #edf2f7; margin: 0; padding: 0; width: 100%;">
                        <tr>
                            <td align="center" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative;">
                                <table class="content" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; -premailer-cellpadding: 0; -premailer-cellspacing: 0; -premailer-width: 100%; margin: 0; padding: 0; width: 100%;">
                                    <tr>
                                        <td class="header" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; padding: 25px 0; text-align: center;">
                                            <a href="${Req.headers.origin}/" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; color: #3d4852; font-size: 19px; font-weight: bold; text-decoration: none; display: inline-block;">
                                              ${process.env.APP_NAME}
                                            </a>
                                        </td>
                                    </tr>
                    
                                    <!-- Email Body -->
                                    <tr>
                                        <td class="body" width="100%" cellpadding="0" cellspacing="0" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; -premailer-cellpadding: 0; -premailer-cellspacing: 0; -premailer-width: 100%; background-color: #edf2f7; border-bottom: 1px solid #edf2f7; border-top: 1px solid #edf2f7; margin: 0; padding: 0; width: 100%;">
                                            <table class="inner-body" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; -premailer-cellpadding: 0; -premailer-cellspacing: 0; -premailer-width: 570px; background-color: #ffffff; border-color: #e8e5ef; border-radius: 2px; border-width: 1px; box-shadow: 0 2px 0 rgba(0, 0, 150, 0.025), 2px 4px 0 rgba(0, 0, 150, 0.015); margin: 0 auto; padding: 0; width: 570px;">
                                                <!-- Body content -->
                                                <tr>
                                                    <td class="content-cell" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; max-width: 100vw; padding: 32px;">
                                                        <h1 style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; color: #3d4852; font-size: 18px; font-weight: bold; margin-top: 0; text-align: left;">
                                                           Hello ${name}
                                                        </h1>
                                                        
                                                        <p style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; font-size: 16px; line-height: 1.5em; margin-top: 0; text-align: left;">
                                                        アカウントは販売に使用する準備ができています。
                                                        </p>
                                                            <p>User Accounts Informations</p>
                                                            <hr>
                                                            <ul>  
                                                            <li>Name: ${name}</li>
                                                            <li>Email: ${email}</li>
                                                            <li>UserName: ${email}</li>
                                                            <li>Temporary Passwords: ${tempPass}</li>
                                                            </ul>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                    
                                    <tr>
                                        <td style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative;">
                                            <table class="footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; -premailer-cellpadding: 0; -premailer-cellspacing: 0; -premailer-width: 570px; margin: 0 auto; padding: 0; text-align: center; width: 570px;">
                                                <tr>
                                                    <td class="content-cell" align="center" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; max-width: 100vw; padding: 32px;">
                                                        <p style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; line-height: 1.5em; margin-top: 0; color: #b0adc5; font-size: 12px; text-align: center;">
                                                        © ${new Date().getFullYear()} ${process.env.APP_NAME}. All rights reserved.
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    </body>
                    </html>`
    let toMail = email;
    let subject = 'User Registration confirmation';
    let text = 'Account confirmations';
    try {
        //let mailSend = await sendMail.mailSendToUserMail(toMail,subject,text,output);
        let mailSend = await mailer.send(subject,output,toMail);
        return "OK";
    } catch (error) {
        errorLog(Req,null,error);
        console.log(error);
        return 'ERROR';
    }
}