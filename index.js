const dotenv = require('dotenv');
dotenv.config();

let { app } = require('./app');

const http = require('http');
const fs = require('fs');
const https = require('https');

//import ssl certificate
if (process.env.HTTPS_MODE == 'on') {
    const httpsOptions = {
        cert: fs.readFileSync(process.env.SSL_CERTIFICATE_PATH, 'utf8'),
        key: fs.readFileSync(process.env.SSL_PRIVATE_KEY_PATH, 'utf8')
    }

    //create httpsServer
    const httpsServer = https.createServer(httpsOptions, app);

    httpsServer.listen(process.env.HTTPS_PORT, () => {
        console.log(`Https Listening on port: ${process.env.HTTPS_PORT}`);
    });
}


var server = http.createServer(app, (req, res) => {
    // console.log(req.headers);
    if (process.env.HTTPS_MODE == 'on') {
        res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
        res.end();
    }
});

server.listen(process.env.HTTP_PORT, () => {
    console.log(`Http Listening on port: ${process.env.HTTP_PORT}`);
});
