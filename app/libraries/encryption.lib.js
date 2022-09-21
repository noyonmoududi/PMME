const CryptoJS = require('crypto-js');
exports.encrypt = (text) =>{
    var ciphertext = CryptoJS.AES.encrypt(text, '6087652191').toString();
    return ciphertext;
};

exports.decrypt = (ciphertext) =>{
    let bytes  = CryptoJS.AES.decrypt(ciphertext, '6087652191');
    let originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};