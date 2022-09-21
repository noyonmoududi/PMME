module.exports = class RecaptchaVerify{
    constructor(){}

    async verify(Req,Res,fromApi_Token){
        let request = require('request');
        // getting site key from client side
        const response_key = typeof (fromApi_Token) != 'undefined' ? fromApi_Token:Req.body["g-recaptcha-response"];
        // Put secret key here, which we get from google console
        const secret_key = process.env.reCAPTCHA_SCERATE_KEY;
        // Hitting POST request to the URL, Google will
        // respond with success or error scenario.
        const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}&remoteip=${Req.connection.remoteAddress}`;

        // Making POST request to verify captcha
        return new Promise((resolve, reject) => {
            request(verificationURL, function(error,response,body) {
                if (error) {
                    resolve(error);
                } else {
                    let result = JSON.parse(body);
                    resolve(result);
                }
                
            })
        })
       
    }
}


