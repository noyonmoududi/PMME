const artisan = require('./system/artisan'),
    allowed_elements = ['controller', 'model', 'middleware', 'library'];
let action = process.argv[2],
    obj = process.argv[3],
    file_name = process.argv[4],
    action2 = process.argv[5],
    action2_desc = process.argv[6],
    colors = artisan.colors,
    helps = artisan.helps,
    direction_msg = `please use ${colors.green}"node artisan -h"${colors.reset} to know all commands.`;
logHelpline = () => {
    console.log(direction_msg)
}

if (obj == 'c') obj = 'controller'
if (obj == 'm') obj = 'model'
if (obj == 'lib') obj = 'library'

if (action == '-h') action = 'help'

// action 2 modified
if (action2 == '-f' || action2 == '-d' || action2 == '-dir' || action2 == '-folder') action2 = '-dir';

if (!action) {
    console.log(`${colors.red}Error: artisan command not provided. ${colors.reset}`)
    logHelpline()
}

if (action == 'make') {
    if (!obj) {
        console.log(`${colors.red}Error: artisan command not provided. ${colors.reset}`);
        logHelpline()
        process.exit()
    }
    if (allowed_elements.includes(obj)) {
        if (file_name) {
            let dir_path = "";
            if (action2 == '-dir') {
                if (action2_desc) {
                    dir_path = action2_desc;
                } else {
                    console.log(`${colors.red}Error: dir path not provided. ${colors.reset}`)
                    logHelpline()
                    process.exit();
                }
            }
            artisan.generate(obj, file_name, dir_path);

        } else {
            console.log(`${colors.red}Error: ${obj} name not provided. ${colors.reset}`)
            logHelpline()
        }
    } else if (obj == 'migration') {
        if (file_name) {
            let fields;
            if (process.argv.indexOf('-fields') > 0) {
                fields = process.argv[process.argv.indexOf('-fields') + 1]
                if (fields) {
                    try {
                        fields = fields.split(",")
                    } catch (err) {
                        console.log(`${colors.red}Error: Invalid fields format. ${colors.reset}`)
                        logHelpline()
                    }
                } else {
                    console.log(`${colors.red}Error: fileds list not provided. ${colors.reset}`)
                    logHelpline()
                    process.exit();
                }
            }
            artisan.generate(obj, file_name, "", fields);
        } else {
            console.log(`${colors.red}Error: ${obj} name not provided. ${colors.reset}`)
            logHelpline()
        }
    }
    else {
        console.log(`${colors.red}Error: ${obj} command not found. ${colors.reset}`)
        logHelpline()
    }
}
else if (action == 'help') {
    console.log(`${colors.blue}All Artisan Commands:${colors.reset}`)
    for (let com of helps) {
        console.log(`${colors.green}${com}${colors.reset}`)
    }
}
else if (action == 'run') {
    let package = require('./system/Packages')
    try {
        package(process.argv)
    } catch (err) {
        console.log(`${colors.red}Error: ${err} (Package:${obj}) ${colors.reset}`)
    }
}
else {
    console.log(`${colors.red}Error: artisan ${action} not found. ${colors.reset}`)
    logHelpline()
}