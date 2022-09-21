const Controller = require('../../Controller');

module.exports = class user extends Controller {

    constructor() {
        super();
    }

    forgotPassword(Req, Res) {
        let data = {
            Request: Req,
            errors: Req.flash('errors')[0],
            old: Req.flash('old')[0],
        }
        Res.render('admin/auth/password/check_user', data);
    }
    async sendPasswordResetLink(Req, Res) {
        let RequestData = loadValidator(Req, Res);
        let email = RequestData.post('email', true).val();
        let UserModel = loadModel('UserModel');
        if (!RequestData.validate()) return false;
        let checkUser = await UserModel.db(UserModel.table).where({email}).select().first();
        if (checkUser) {
            let VerifyUserModel = loadModel('VerifyUserModel');
            const { v4: uuidv4 } = require('uuid');
            let uoken = uuidv4();
            let tokenSave = await VerifyUserModel.db(VerifyUserModel.table).insert({
                user_id:checkUser.id,
                token:uoken,
                created_at:new Date(),
                updated_at:new Date(),
            });      
            if (tokenSave) {
                let sendMail = await sendMailForResetPass(Req,uoken,checkUser.email);
            }
            Req.session.flash_success_msg = `Password Reset link successfully Send to your Register mail address.`;
            return Res.redirect(`/admin/forgot-password`);
        } else {
            Req.session.flash_error_msg = `Email is not valid!`;
            return Res.redirect(`/admin/forgot-password`);
        }
    }

    async resetPassword(Req, Res) {
        let data = {
            Request: Req,
            errors: Req.flash('errors')[0],
            old: Req.flash('old')[0],
        }
        let resetToken = Req.params['token'];
        let VerifyUserModel = loadModel('VerifyUserModel');
        let tokenDetails = await VerifyUserModel.db(VerifyUserModel.table).where({token:resetToken}).select().first();
        if (tokenDetails) {
            let UserModel = loadModel('UserModel');
            let userData = await UserModel.db(UserModel.table).where({id:tokenDetails.user_id}).select(['name','email']).first();
            data.old=userData;
            data.token =resetToken;
            Res.render('admin/auth/password/reset_password', data);
        }else{
            //Req.session.flash_error_msg = `Something went wrong!.`;
            Res.render('errors/404', data);
             //return back(Req, Res);
        }
    }

    async resetPasswordSave(Req, Res) {
        const bcrypt = require('bcryptjs');
        let resetToken = Req.params['token'];
        let RequestData = loadValidator(Req, Res);
        let email = RequestData.post('email', true).val();
        let password = RequestData.post('password', true, 'password').sameAs('confirm_password').val();
        let UserModel = loadModel('UserModel');
        let VerifyUserModel = loadModel('VerifyUserModel');
        if (!RequestData.validate()) return false;

        let hashPass = bcrypt.hashSync(password,10);
        let tokenDetails = await VerifyUserModel.db(VerifyUserModel.table).where({token:resetToken}).select().first();
        if (tokenDetails) {
            let updatePass = await UserModel.db(UserModel.table).where({email}).update({password:hashPass});
            if (updatePass) {
                let tokenDelete = await VerifyUserModel.db(VerifyUserModel.table).where({token:resetToken}).delete();
                Req.session.flash_success_msg = `Password Reset successfully.`;
                return Res.redirect(`/admin/login`);
            } else {
                Req.session.flash_error_msg = `Something Went Wrong!.`;
                return Res.redirect(`/admin/login`);
                //return back(Req,Res);
            }
        }else {
            Req.session.flash_error_msg = `User not found!.`;
            return Res.redirect(`/admin/login`);
        }
        
    }

}


async function sendMailForResetPass(Req,token,email) {
    const mailer = loadLibrary('mailer');
    // const SendMail = loadLibrary('sendMail');
    // let sendMail = new SendMail();

    let output =`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
                                                           Hello　様
                                                        </h1>
                                                       
                                                        <p style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; font-size: 16px; line-height: 1.5em; margin-top: 0; text-align: left;">
                                                        パスワードリンクのリセット
                                                        </p>
                                                            
                                                        <table class="action" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; -premailer-cellpadding: 0; -premailer-cellspacing: 0; -premailer-width: 100%; margin: 30px auto; padding: 0; text-align: center; width: 100%;">
                                                            <tr>
                                                                <td align="center" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative;">
                                                                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative;">
                                                                        <tr>
                                                                            <td align="center" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative;">
                                                                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative;">
                                                                                    <tr>
                                                                                        <td style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative;">
                                                                                            <a href="${Req.headers.origin}/admin/reset-password/${token}" class="button button-primary" target="_blank" rel="noopener" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; -webkit-text-size-adjust: none; border-radius: 4px; color: #fff; display: inline-block; overflow: hidden; text-decoration: none; background-color: #2d3748; border-bottom: 8px solid #2d3748; border-left: 18px solid #2d3748; border-right: 18px solid #2d3748; border-top: 8px solid #2d3748;">Reset Password Link</a>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                    
                                                        <p style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; font-size: 16px; line-height: 1.5em; margin-top: 0; text-align: left;">
                                                            ※メールアドレスをご登録された覚えのない場合、リンクにアクセスする必要はありません。このメールは破棄して頂けますようお願い申し上げます。
                                                        </p>
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
    let subject = 'Password Reset';
    let text = 'Password Reset';
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