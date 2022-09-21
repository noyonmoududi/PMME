exports.utils = {
    removeSecret: (data) => {
        for (let key in data) {
            if (key.includes('password')) data[key] = '********';
        }
        return data;
    },
    genReqId: (req) => {
        let randomstring = require("randomstring");
        let request_id = new Date().valueOf() + randomstring.generate({
            length: 13,
            charset: 'hex'
        });
        req.request_id = request_id;
        return request_id;
    }
}