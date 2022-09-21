require('./loader');

let middleWareFiles = allFilesSync('./app/middleware/');
//console.log(JSON.stringify(middleWareFiles));
let middleWares = {};
middleWareFiles.forEach((file) => {
    let name = file.file.replace(".js", "");
    middleWares[name] = require(`../app/middleware/${name}`);

});
exports.middleWares = middleWares;

let routeFiles = allFilesSync('./routes/');
let allRoutes = {};
routeFiles.forEach((file) => {
    let name = file.file.replace(".js", "");
    allRoutes[name] = require(`../routes/${name}`);
});
exports.allRoutes = allRoutes;
