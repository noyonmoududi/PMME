module.exports = (argv) => {
    let package_name = argv[3];
    let pack;
    try {
        pack = require('./' + package_name);
    } catch (err) {
        throw 'Package not found';
    }
    try {
        pack(argv)
        return true;
    } catch (err) {
        throw err;
    }
}