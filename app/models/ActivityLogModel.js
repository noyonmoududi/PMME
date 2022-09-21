const Model = loadCore('model');

module.exports = class ActivityLogModel extends Model {
    constructor() {
        super();
        this.table = 'activity_log';
        this.primaryKey = 'id';
    }

    saveLogData(req,res,message,subject,subjectId) {
        let _this = this;
        let saveRes = {
            save: '',
            data: {}
        };
        return new Promise((resolve, reject) => {
            var user_ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            var ip=  user_ip.replace(/::ffff:/g,"");
            if (req.path == '/logout') {
                message = req.session.user.name +' '+ message;
            }else if (req.path == '/login') {
                message = req.session.user.name +' '+ message;
            }else{
                message = message +' '+ req.session.user.name;
            }
            let req_data = {
                log_name: req.path,
                description: message,
                ip_address: ip,
                user_agent: req.get('user-agent'),
                subject_type: subject,
                subject_id: subjectId,
                causer_id: (typeof req.session.user != 'undefined') ? req.session.user.id : null,
                created_at: new Date(),
                updated_at: new Date(),
            }

            _this.db(_this.table).insert(req_data).then(res => {
                saveRes.save = 'success';
                resolve(saveRes);
            }).catch(err => {
                errorLog(req,res,err);
                req.session.flash_toastr_error = 'Something went wrong';
                saveRes.error = 1;
                saveRes.save = 'fail';
                saveRes.data = { message: 'Data not saved, Something went wrong!' };
                reject(saveRes);
            })
        })
    }
}
