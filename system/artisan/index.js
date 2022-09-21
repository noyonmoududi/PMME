const config = require('./config')
let colors = config.colors;
const Generator = require('./generator');
/**
 * 
 * @param {string} g required @example "controller"/"model"/"library"/"middleware"
 * @param {string} file_name required
 * @param {string} dir_path not required @example folder1, folder/folder1 etc
 * @param {*} descriptions not required @example fields = {"field1:int","field2"}  etc
 * @returns 
 */
const generate = (g, file_name, dir_path = "", descriptions = {}) => {

    let generator = new Generator(g, file_name, dir_path, descriptions)
    generator.execute();

    let arguments = process.argv.slice(5, process.argv.length);
    if (g == 'model' && arguments.includes('--all')) {
        // create controller file
        let controller = new Generator('controller', file_name, dir_path, descriptions);
        controller.execute()

        // create migration file
        let fields = {};
        if (arguments.indexOf('-fields') > 0) {
            let fields_string = arguments[arguments.indexOf('-fields') + 1]
            if (fields_string) {
                fields = fields_string.split(',')
            } else {
                console.log(`${colors.red}Error: fileds list not provided. ${colors.reset}`)
                logHelpline()
                process.exit();
            }
        }
        let { pluralize } = require('../utils');
        let migration = new Generator('migration', pluralize(file_name), "", fields);
        migration.execute()
    }
}

module.exports = {
    colors: config.colors,
    helps: config.helps,
    generate,
    Generator
}
