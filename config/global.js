/*
 @Purpose: Global object/variables/helper function develop here
*/

const config = require('./config');
const errors = require('./errors')

global.BaseUrl = '';
global.Debug = config.debug;

/**
 *  @Json Response for errors
 **/
global.ERRORS = errors;
global.ApiErrorResponse = (Res, error_code, err_msg = null) => {
    try {
        let req = Res.req,
            error_title = (errors[error_code]) ? errors[error_code].title : error_code.replace("_", ""),
            error_message = (err_msg) ? err_msg : ((errors[error_code]) ? errors[error_code].message : 'Something Went Wrong'),
            res = {
                result_code: errors[error_code].result_code,
                time: moment().tz(Config.timezone).format('YYYY-MM-DD H:m:ss'),
                error: {
                    title: error_title,
                    message: error_message
                }
            };
        try {
            

        } catch (err) {
            console.log(err)
        }
        Res.setHeader('Content-Type', 'Application/json');
        Res.status(((errors[error_code]) ? errors[error_code].header_status : 500));
        Res.send(res);
        Res.end();
    } catch (e) {
        console.log('Something Went wrong while responding JSON');
        console.log(e);
    }
};


/**
 * Global API Response function
 * @param JSON Response
 * @param result
 * @constructor
 */
global.ApiResponse = (Response, result = null) => {
    try {
        let { client_type } = Response.req.query;
        let responseData = {
            "result_code": 0,
            "time": moment().tz(Config.timezone).format('YYYY-MM-DD H:m:ss'),
            "maintenance_info": null,
            result: null,
        };
        if (client_type == 1 || client_type == 2) {
            let app_status = loadAppConfig(),
                client_config = app_status[Constants.client_types[client_type]];
            responseData.maintenance_info = {
                maintenance_mode: client_config.maintenance_mode,
                maintenance_time: client_config.maintenance_time
            };
        }
        if (typeof result == 'string') responseData.result = { message: result };
        else responseData.result = result
        
        if (result.pagination) {
            responseData.pagination = result.pagination;
            //delete result.pagination;
        }
        Response.setHeader('Content-Type', 'Application/json');
        Response.status(200);
        Response.send(responseData);
        Response.end();
    } catch (e) {
        console.log(e)
        console.log('ApiResponse method error');
    }

};

global.ucFirst = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

global.lcFirst = function (str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
};
global.isInteger = (value) => {
    let x;
    return isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x);
};
global.isNumber = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
};
global.isEmail = (email) => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);

}

global.getKeyOfMax = (obj) => {
    let max;
    for (let v in obj) {
        if (max) {
            if (obj[v] > obj[max]) {
                max = v;
            }
        } else {
            max = v;
        }
    }
    return max;
};

global.allowLang = ['en'];
global.Languages = {
    en: 'English'
};

global.isApiCall = (Req) => {
    return (Req.xhr || Req.originalUrl.includes('/api/') || Req.query['json']);
}

/**
 * 
 * @param XML xml 
 * @returns JSON
 */
global.parseXmlToJson = (xml) => {
    try {
        let json = {};
        for (let res of xml.matchAll(/(?:<(\w*)(?:\s[^>]*)*>)((?:(?!<\1).)*)(?:<\/\1>)|<(\w*)(?:\s*)*\/>/gm)) {
            const key = res[1] || res[3];
            const value = res[2] && parseXmlToJson(res[2]);
            json[key] = ((value && Object.keys(value).length) ? value : res[2]) || null;

        }
        return json;
    } catch (err) {
        throw 'Invalid json format'
    }
}


global.errorLog = (req,res,err_msg) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {
                time: new Date().toLocaleString(),
                path: req.path,
                error: err_msg.toLocaleString(),
                ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                "user-agent": req.get('user-agent')
            }
            let fs = require('fs');
            let log_folder ='./logs/error-logs';
            // check if directory exists
            if (!fs.existsSync('logs')) {
                // if not create directory
                    fs.mkdirSync('logs');
            }
            if (!fs.existsSync(log_folder)) {
                // if not create directory
                    fs.mkdirSync(log_folder);
            
            }
            let file_path = log_folder +'/' + currentDate() + '-errors.log'
            
            fs.appendFile(file_path, JSON.stringify(data) + "\n", null, function (err, data) {
                if (err) reject(err)
                else resolve(file_path)
            });
        } catch (err) {
            reject(err)
        }
    })
}