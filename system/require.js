require('./validation').validate();
global.Constants = require('../config/constants');
global.Config = require('../config/config');
require('../config/global');
path = require('path');
flash = require('express-flash');

express = require('express');
moment = require('moment-timezone');
if (!moment.tz.zone('Asia/Dhaka')) moment.tz.add("Asia/Dhaka|HMT +0630 +0530 +06 +07|-5R.k -6u -5u -60 -70|0121343|-18LFR.k 1unn.k HB0 m6n0 2kxbu 1i00|16e6");

app = express();
app.use(flash());

// const cookie = require('cookie-parser');
const session = require('cookie-session');
app.use(session({
    secret: 'set',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: Config.session_expired,
        sameSite: true
    }
}));

// injecting view services
let sys_injectable_services = require('./services/view.inject'),
    custom_injectable_services = require('../dependencies/view.inject'),
    injectable_services = { ...sys_injectable_services, ...custom_injectable_services };
for (let key in injectable_services) {
    app.locals[key] = injectable_services[key];
}