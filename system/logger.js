const {utils} = require('./logger-utils')

exports.requestlog = async (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let body = { ...req.body };
            body = utils.removeSecret(body);
            let request_id = utils.genReqId(req)

            let data = {
                request_id,
                time: new Date().toLocaleString(),
                path: req.path,
                params: JSON.stringify(req.params),
                query_params: JSON.stringify(req.query),
                body: JSON.stringify(body),
                ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                "user-agent": req.get('user-agent')
            }
            let fs = require('fs');
            let log_folder ='./logs/action-logs';
            // check if directory exists
            if (!fs.existsSync('logs')) {
                // if not create directory
                    fs.mkdirSync('logs');
            }
            if (!fs.existsSync(log_folder)) {
                // if not create directory
                    fs.mkdirSync(log_folder);
            
            }
            //let file_path = './logs/action-logs/' + currentDate() + '-user-request.log'
            let file_path = log_folder +'/' + currentDate() + '-user-request.log'
            fs.appendFile(file_path, JSON.stringify(data) + "\n", null, function (err, data) {
                if (err) reject(err)
                else resolve(file_path)
            });
        } catch (err) {
            reject(err)
        }
    })
}