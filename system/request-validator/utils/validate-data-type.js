const utils = require('./validator-utils');

exports.isValidDataType = (value, type) => {
    let is_valid = true;
    if (type == 'int') type = 'integer';
    else if (type == 'bool') type = 'boolean';
    else if (type == 'float') type = 'number';

    if (type == 'integer') {
        if (!utils.isInteger(value)) is_valid = false;
        else value = parseInt(value)

    } else if (type == 'number') {
        if (!utils.isNumber(value)) is_valid = false;

    } else if (type == 'email') {
        if (!utils.isEmail(value)) is_valid = false;

    } else if (type == 'boolean') {
        if (!['true', 'false'].includes(value)) is_valid = false;
        else {
            value = (value.toLocaleLowerCase() == 'true' || value === true)
        }
    } else if (type == 'date') {
        if (!utils.isDate(value)) is_valid = false;
    } else if (type == 'array_int') {
        try {
            value = (!Array.isArray(value)) ? JSON.parse(value) : value;
            if (Array.isArray(value)) {
                if (value.length == 0 && isRequired) {
                    is_valid = false;
                } else {
                    value.every(value => {
                        if (isNaN(value) || parseInt(value) != value) {
                            is_valid = false;
                            return false;
                        }
                        else return true;
                    })
                }
            } else is_valid = false;
        } catch (e) {
            is_valid = false;
        }
    } else if (type == 'mobile_bd') {
        const valid_mobile = (value) => {
            let valid_number = value.match("(?:\\+88|88)?(01[3-9]\\d{8})"); /*Regular expression to validate number*/
            if (valid_number) {
                return valid_number[1];
            } else {
                return false;
            }
        }
        let value_temp = valid_mobile(value);
        if (!value_temp || value_temp.length != 11) is_valid = false;
        else value = value_temp;
    }
    else {
        if (typeof value != type) is_valid = false;
    }
    return is_valid;
}