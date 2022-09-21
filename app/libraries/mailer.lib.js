const nodemailer = require('nodemailer');

const mail_user = process.env.MAIL_USERNAME;
const mail_password = process.env.MAIL_PASSWORD;
const mail_host = process.env.MAIL_HOST;
const mail_port = process.env.MAIL_PORT;
const mail_from_address = process.env.MAIL_FROM_ADDRESS;

class Mailer {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: mail_host,
            port: mail_port,
            secure: false,
            requireTLS: true,
            auth: {
                user: mail_user,
                pass: mail_password
            }
        });
    }
    async verify() {
        return new Promise((resolve, reject) => {
            this.transporter.verify(function (err, success) {
                if (err) {
                    return reject(error);
                } else {
                    return resolve("Server is ready to send mail");
                }
            });
        })
    }
    async send(subject, html,toAddress) {
        let mailOptions = { subject, html, from: mail_from_address, to: toAddress }
        return new Promise((resolve, reject) => {
            this.transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    reject(error);
                } else {
                    console.log('Email sent successfully:' + mailOptions.to);
                    resolve('Email sent to:' + mailOptions.to);
                }
            });
        })
    }

}
const mailer = new Mailer();
module.exports =mailer;
