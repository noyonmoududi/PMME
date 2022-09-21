const allowed_actions = ['controller', 'model', 'middleware', 'library'];
const path_link = require('../config.json')['directory'],
    colors = {
        reset: '\033[0m',
        black: '\033[30m',
        red: '\033[31m',
        green: '\033[32m',
        yellow: '\033[33m',
        blue: '\033[34m',
        white: '\033[37m'
    },
    helps = [
        "make controller [name]                             --- to generate controller file",
        "make c [name]                                      --- to generate controller file",
        "make controller [name] -dir [sub dir path]        --- to generate controller file in sub directory",

        "make model [name]                                  --- to generate model file",
        "make m [name]                                      --- to generate model file",
        "make model [name] -dir [sub dir path]             --- to generate model file in sub directory",

        "make library [name]                                --- to generate library file",
        "make lib [name]                                    --- to generate library file",
        "make library [name] -dir [sub dir path]           --- to generate library file in sub directory",

        "make middleware [name]                             --- to generate middleware file",
        "make middleware [name] -dir [sub dir path]        --- to generate middleware file in sub directory",

        "help                                               --- to view artisan commands",
        "-h                                                 --- to view artisan commands"
    ];
module.exports = {
    allowed_actions,
    colors,
    helps,
    path_link
}