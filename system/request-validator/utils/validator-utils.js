module.exports = {
    isInteger: (value) => {
        if (isNaN(value) || parseInt(value) != value) return false;
        else return true;
    },
    isNumber: (value) => {
        return !isNaN(parseFloat(value)) && isFinite(value);
    },
    isEmail: (value) => {
        var emailRegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (emailRegEx.test(value) == false) return false;
        else return true;
    },
    isBoolean: (value) => {
        if (typeof value == 'boolean') return true;
        else if (['true', 'false'].includes(value)) return true;
        else return false;
    },
    isDate: (value) => {
        let isValidDate = (dateString) => {
            var regEx = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateString.match(regEx)) return false;  // Invalid format
            var d = new Date(dateString);
            var dNum = d.getTime();
            if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
            return d.toISOString().slice(0, 10) === dateString;
        }
        if (isValidDate(value)) return true;
        else return false;
    }
}