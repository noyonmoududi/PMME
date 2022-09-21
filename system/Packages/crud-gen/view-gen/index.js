let { colors } = require('../../../artisan');
module.exports = class view {

    constructor(folder, layout, item, fields, route) {
        this.folder = folder;
        this.fields = fields;
        this.route = route;
        this.item = this.toUpperFirstAll(item)
        this.layout = layout;
    }

    toUpperFirstAll(str) {
        str = str.replace(/_/g, ' ')
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };

    generate() {
        const fs = require('fs');

        //generate dir if not exist
        let dir = "app/views/pages/" + this.folder + '/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // final file path

        let item = this.item;

        let layout_path = '../../'
        let layout_dir_array = this.folder.split('/');
        for (let i = 1; i < layout_dir_array.length; i++) {
            layout_path += '../'
        }
        layout_path += this.layout;

        let files = [
            {
                file_path: dir + 'create.ejs',
                content: require('./contents/create').getContent(item, layout_path, this.route)
            },
            {
                file_path: dir + 'edit.ejs',
                content: require('./contents/edit').getContent(item, layout_path, this.route)
            },
            {
                file_path: dir + 'form.ejs',
                content: require('./contents/form').getContent(this.fields)
            },
            {
                file_path: dir + 'index.ejs',
                content: require('./contents/index').getContent(item, layout_path, this.fields, this.route)
            },
            {
                file_path: dir + 'show.ejs',
                content: require('./contents/show').getContent(item, layout_path, this.fields, this.route)
            }
        ]

        for (let file of files) {
            let file_path = file.file_path;
            let content = file.content;
            //checking file existence
            if (fs.existsSync(file_path)) {
                console.error(`${colors.red}Error: "${file_path}" already exist.${colors.reset}`);
                continue;
            }
            try {
                fs.writeFileSync(file_path, content);
                console.log(`${colors.green}${file_path} created successfully.${colors.reset}`)
            } catch (err) {
                console.error(err);
            }
        }


    }
}
