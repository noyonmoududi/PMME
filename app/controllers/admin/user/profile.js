const Controller = require('../../Controller');

module.exports = class UserModel extends Controller {

    constructor() {
        super();
    }

    async profileEdit(Req, Res) {
        let data = {
            Request: Req,
            errors: Req.flash('errors')[0],
            old: Req.flash('old')[0]
        }
        let RequestData = loadValidator(Req, Res);
        let user_id = Req.session.user.id;
        let UserModel = loadModel('UserModel');
        let rowdata = await UserModel.db(UserModel.table).where({id:user_id}).first();
        data.userData = rowdata;
        let tab =  RequestData.get('tab');
        data.tab_index =(typeof tab !='undefined'?tab:'basic');
        Res.render('admin/profile/profile_edit',data);
    }

    async basicInfoUpdate(Req, Res) {
        let ActivityLogModel = loadModel('ActivityLogModel');
        try {
            let RequestData = loadValidator(Req, Res);
            let req_data = {
                name: RequestData.post('name', true, 'Name').val(),
                phone: RequestData.post('phone', true, 'Phone').val(),
                updated_at:new Date()
            };
            if (!RequestData.validate()) return false;
            let user_id = Req.session.user.id;
            let UserModel = loadModel('UserModel');
            let basicInfoUpdate = await UserModel.db(UserModel.table).where('id', user_id)
            .update({...req_data});
            await ActivityLogModel.saveLogData(Req,Res,'User Profile Has been updated by',UserModel.table,user_id);
            Req.session.user.name=req_data.name;
            Req.session.flash_toastr_success = 'User Profile Updated successfully!';
            Res.redirect(`/admin/profile?tab=${'basic'}`);
        } catch (error) {
            errorLog(Req,Res,error);
            console.log(error);
            Req.session.flash_toastr_error = 'Something Went Wrong!';
            return back(Req, Res);
        }
        
    }

    async passwordUpdate(Req, Res) {
        let ActivityLogModel = loadModel('ActivityLogModel');
        const bcrypt = require('bcryptjs');
        try {
            let RequestData = loadValidator(Req, Res);
            let req_data = {
                password: RequestData.post('password', true, 'Password').sameAs('retypePassword').val(),
                updated_at:new Date()
            };
            if (!RequestData.validate()) return false;
            req_data.password = bcrypt.hashSync(req_data.password, 10);
            let user_id = Req.session.user.id;
            let UserModel = loadModel('UserModel');
            let basicInfoUpdate = await UserModel.db(UserModel.table).where('id', user_id)
            .update({...req_data});
            await ActivityLogModel.saveLogData(Req,Res,'User Password Has been updated by',UserModel.table,user_id);
            Req.session.flash_toastr_success = 'User Password Updated successfully!';
            Res.redirect(`/admin/profile?tab=${'security'}`);
        } catch (error) {
            errorLog(Req,Res,error);
            console.log(error);
            Req.session.flash_toastr_error = 'Something Went Wrong!';
            return back(Req, Res);
        }
        
    }

    async userImageUpdate(Req, Res) {
        let ActivityLogModel = loadModel('ActivityLogModel');
        let uploadfileName =null;
        let uploadOrginalfileName =null;
        let savefilePath = '/';
        try {
                if (Req.files && Req.files.length > 0) {
                    uploadfileName = Req.files[0].filename;

                    uploadOrginalfileName = Req.files[0].originalname;
                    const last = Req.files[0].destination.split("/");
                    savefilePath += last[last.length-2];

                    let oldImage = Req.body.oldProfileImage;

                    let req_data = {
                        photo:uploadfileName,
                        updated_at:new Date(),
                    };
                    let user_id = Req.session.user.id;
                    let UserModel = loadModel('UserModel');
                    await deleteFile(oldImage);
                    let imageUpdate = await UserModel.db(UserModel.table).where('id', user_id)
                    .update({...req_data});
                    await ActivityLogModel.saveLogData(Req,Res,'User Profile Image Has been updated by',UserModel.table,user_id);
                    Req.session.user.photo=req_data.photo;
                    Req.session.flash_toastr_success = 'Profile Image updated successfully.';
                    Res.redirect(`/admin/profile?tab=${'imageUpload'}`)

                }else{
                    Req.session.flash_toastr_error = 'File is required!.';
                    return back(Req,Res);
                }
        } catch (error) {
            errorLog(Req,Res,error);
            await deleteFile(uploadfileName);
            console.log(error);
            return back(Req,Res);
        }
    }
}

async function deleteFile(filename) {
    if (filename && filename != null) {
        const fs = require("fs");
        if (fs.existsSync(`./file_storage/user-photos/${filename}`)) {
            fs.unlink(`./file_storage/user-photos/${filename}`,function(err){
                if(err) console.log(err);
                console.log('Upload file deleted successfully');
            }); 
        }  
    }
}