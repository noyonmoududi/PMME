const Controller = require('./Controller');
module.exports = class home extends Controller {

    constructor() {
        super();
    }

    async index(Req, Res) {
        let data = {
            Request: Req
        }
        if (Req.session.user) {
            return Res.redirect(`/admin/`);
        }
        // let ProjectModel = loadModel('ProjectModel');
        // let listofObject=[];
        // let Excel = loadLibrary('excel');
        // let verifyResult = await Excel.readSheet('D:/PROJECT/Professional/RM_SHISHIR/GIT-Project/xels_io_marketplace_backend/public/temp/ProjectC02.xlsx',0);
        // for (let i = 1; i < verifyResult.length; i++) {
        //     const elementKey = verifyResult[0];
        //     const element = verifyResult[i];
        //     let obj = {
        //         project_num:element[0],
        //         project_name:element[1],
        //         provider_id:element[2],
        //         type:element[3],
        //         methodology_protocol:element[4],
        //         region:element[5],
        //         country:element[6],
        //         project_site_location:element[7],
        //         project_developer:element[8],
        //         //created_at:element[9],
        //         //updated_at:element[10],
        //         registry_url:element[11],
        //         description:element[12],
        //     }
        //     listofObject.push(obj);
        // }
        // let saveprojects = await ProjectModel.db(ProjectModel.table).insert(listofObject);
        Res.render('pages/index', data);
    }
    dashboard(Req, Res) {
        let data = {
            Request: Req
        }
        Res.render('pages/dashboard', data);
    }
}


