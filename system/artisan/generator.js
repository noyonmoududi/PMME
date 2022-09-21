const utils = require('./code-gen')
const config = require('./config')
let path_link = config.path_link
let colors = config.colors;

module.exports = class generator {
    /**
     * 
     * @param {string} g required @example "controller"/"model"/"library"/"middleware"
     * @param {string} file_name required
     * @param {string} dir_path not required @example folder1, folder/folder1 etc
     * @param {*} descriptions not required @example fields = {"field1:int","field2"}  etc
     * @returns 
    */
    constructor(g, file_name, dir_path = "", descriptions = {}) {
        this.item = g; //g
        this.file_name = file_name;
        this.dir_path = dir_path;
        this.descriptions = descriptions;
        this.file_content = "";
        this.table_name = "";
    }

    sanitize() {
        let file_name = this.file_name.replace(/-/g, '_');
        let title = file_name;
        if (this.item == 'model') {
            let { pluralize } = require('../utils')
            this.table_name = pluralize(title)

            file_name = file_name.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
            let last5 = file_name.substr(file_name.length - 5);
            if (last5 == 'Model') file_name = file_name.charAt(0).toUpperCase() + file_name.slice(1);
            else file_name = file_name.charAt(0).toUpperCase() + file_name.slice(1) + 'Model';
        }
        else if (this.item == 'library') file_name = file_name.toLowerCase() + '.lib';
        else if (this.item == 'migration') {
            this.table_name = file_name;
            let date = new Date();
            let prefix = date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0];
            prefix = prefix.replace(/-|:| /g, "");
            let action = 'create';
            if (process.argv.includes('--create')) action = 'create';
            else if (process.argv.includes('--alter')) action = 'alter';
            else if (process.argv.includes('--add')) action = 'add_column';
            else if (process.argv.includes('--remove')) action = 'remove_column';
            else if (process.argv.includes('--drop')) action = 'drop';
            file_name = prefix + '_' + action + '_table_' + file_name;
        }
        else file_name = file_name.toLowerCase();
        this.file_name = file_name;
        return true;
    }

    /**
     * 
     * @param {string} item required @example controller/model/library/middleware
     * @param {string} dir_path required @example folder1, folder/folder1 etc
     * @returns 
    */
    generateDirIfNotExist(item, dir_path) {
        const fs = require('fs');
        let dir = path_link[item] + dir_path.toLowerCase() + '/';
        dir = dir.replace(/\/\//g, '/');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        return dir;
    }

    execute() {

        const fs = require('fs');
        let content = this.file_content;

        //generate dir if not exist
        let dir = path_link[this.item];
        if (this.dir_path != "") dir = this.generateDirIfNotExist(this.item, this.dir_path);

        // sanitize filename
        this.sanitize();

        // final file path
        let file_path = dir + this.file_name + '.js';

        //checking file existence
        if (fs.existsSync(file_path)) {
            console.error(`${colors.red}Error: "${file_path}" already exist.${colors.reset}`)
            return false;
        }

        //write file data
        if (content == "") {
            if (this.item == 'controller') content = utils.getControllerCodes(this.file_name);
            else if (this.item == 'model') {
                content = utils.getModelCodes(this.file_name, this.table_name);
            }
            else if (this.item == 'middleware') content = utils.getMiddlewareCodes();
            else if (this.item == 'library') content = utils.getLibraryCodes();
            else if (this.item == 'migration') content = utils.getMigrationCodes(this.table_name, this.descriptions);

            this.file_content = content;
        }

        // create the file with data
        if (!file_path || !content) {
            console.log(`${colors.red} Something went wrong!.${colors.reset}`)
            return false;
        }
        try {
            fs.writeFileSync(file_path, content);
            console.log(`${colors.green}${file_path} created successfully.${colors.reset}`)
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
}
