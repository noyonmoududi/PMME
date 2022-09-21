require('../system/loader');
const express = require('express');
const route = express.Router();
exports.routes = route;
/*
 @write your routes blow:
*/
exports.prefix = '/';
//route.all('*', lang);//lang in route

route.get('/',controller('admin/dashboard/index'));

//dashboard
//route.get('/dashboard',auth,controller('home/dashboard'));
