const fs = require('fs'),
    path = require('path'),
    path_links_conf = require("./config.json");
let path_links = { ...path_links_conf.directory, ...path_links_conf.files };
for (let key in path_links) {
    path_links[key] = ("../" + path_links[key]).replace(/\/\//g, '/');
}
path_links = { ...path_links, ...path_links_conf.system }


allFilesSync = (dir, allfiles = []) => {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) allFilesSync(filePath, allfiles)
        else allfiles.push({
            file: file,
            path: filePath
        })
    });
    return allfiles
};
dirMapTree = (dir, fileList = []) => {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        fileList.push(
            fs.statSync(filePath).isDirectory()
                ? { [file]: dirMapTree(filePath) }
                : file
        )
    });
    return fileList
};


loadModel = (model) => {
    if (model.substr(model.length - 5) != 'Model') model += 'Model';
    let coreModel = require(path_links['model'] + model);
    return new coreModel;
};

loadLibrary = (library) => {
    if (library.substr(library.length - 3) != '.lib') library += '.lib';
    return require(path_links['library'] + library);
};

loadConfig = (config) => {
    return require(path_links['config'] + config);
};

loadAppConfig = () => {
    return require(path_links['app_config']);
};

loadMiddleware = (middleware) => {
    return require(path_links['middleware'] + middleware);
};
loadCore = (core) => {
    return require(path_links['core'] + core);
};
loadSystem = (file) => {
    return require(`./${file}`);
};
loadValidator = (req, res) => {
    let validator = require(path_links['validator']);
    return new validator(req, res);
};
loadPaginator = (req, res) => {
    let { paginator } = require(path_links['paginator']);
    return paginator;
};
controller = (controllerPath) => {
    let split = controllerPath.split("/"),
        path = controllerPath.replace('/' + split[split.length - 1], ''),
        Controller = require(path_links['controller'] + path),
        controller = new Controller();
    return controller[split[split.length - 1]];
};
back = (req, res) => {
    return res.redirect(req.header('Referer') || '/');
}
currentDateTime = (format = 'YYYY-MM-DD H:m:ss') => {
    return moment().tz(Config.timezone).format(format);
}
currentDate = (format = 'YYYY-MM-DD') => {
    return moment().tz(Config.timezone).format(format);
}