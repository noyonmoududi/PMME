const Model = loadCore('model');
const bcrypt = require('bcryptjs');


module.exports = class UserModel extends Model {
    constructor() {
        super();
        this.table = 'users';
        this.tokenTable = 'user_tokens';
        this.primaryKey = 'id';
    }


    attemptLogin(userId, password, Req) {
        let _this = this;
        return new Promise((resolve, reject) => {
            let loginRes = {
                error: 0,
                login: 'success',
                data: {}
            };
            _this.db(_this.table).where({email:userId,status:1}).orWhere({phone:userId,status:1}).first().then(res => {
                if (res) {
                    let user = res;
                    if (user && bcrypt.compareSync(password, user.password)) {
                        Req.session.user = user;
                        loginRes.data = Req.session.user;
                        resolve(loginRes);
                    } else {
                        Req.flash('login_fail', 'E-email/Password didn\'t match');
                        loginRes.error = 1;
                        loginRes.login = 'fail';
                        loginRes.data = { message: 'E-email/Password didn\'t match' };
                        reject(loginRes)
                    }
                } else {
                    Req.flash('login_fail', 'Registered E-mail not Found!');
                    loginRes.error = 1;
                    loginRes.login = 'fail';
                    loginRes.data = { message: 'Registered E-mail not Found!' };
                    reject(loginRes)
                }
            }).catch(err => {
                console.log(err);
                return reject(err)
            })
        })
    }

    encryptPassword(password) {
        const bcrypt = require('bcryptjs');
        return bcrypt.hashSync(password, 10);
    }

    passwordIsValid(user_id, password) {
        let _this = this;
        return new Promise((resolve, reject) => {
            _this.db(_this.table).where('id', user_id).first().then(res => {
                if (res.id) {
                    let user = res;
                    if (user && bcrypt.compareSync(password, user.password)) {
                        resolve({ is_valid: true })
                    } else {
                        resolve({ is_valid: false })
                    }
                } else {
                    reject({
                        is_valid: false,
                        message: 'Registered E-mail not Found!'
                    })
                }
            }).catch(err => {
                console.log(err);
                return reject(err)
            })
        })
    }

    UpatePassword(id, new_passowrd) {
        let password = this.encryptPassword(new_passowrd)
        return this.db(this.table).where('id', id).update({ password });
    }
    addResetLink(Req, email) {
        let _this = this;
        return new Promise((resolve, reject) => {
            _this.db(_this.table).where('email', email).first().then(user => {
                if (user.email) {
                    resolve({ email, message: 'Reset link has sent to "' + email + '"' });
                } else {
                    Req.flash('flash_fail', 'Registered E-mail not Found!');
                    loginRes.error = 1;
                    loginRes.login = 'fail';
                    loginRes.data = { message: 'Registered E-mail not Found!' };
                    reject(loginRes)
                }

            }).catch(err => {
                console.log(err)
                reject(err)
            })
        })
    }
    async userRegistration(userData) {
        try {
            let userDataAfterHashing = await this.generateHash(userData, 'password');
            let insertUser = await this.db(this.table).insert({ ...userDataAfterHashing });
            let insertedId = insertUser[0];
            let newUser = userDataAfterHashing;
            delete newUser.password;
            newUser.id = insertedId;
            return newUser;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
   
    async resetPassword(email, password) {
        try {

            let user = await this.db(this.table).where({ email }).first();
            if (!user) return Promise.reject({ error_code: 'USER_NOT_FOUND' })

            let passwordObj = await this.generateHash({ password }, 'password');
            let status = await this.db(this.table).where({ id: user.id }).update({ ...passwordObj })
            if (status) return Promise.resolve(status)
        } catch (err) {
            console.log(err)
            return Promise.reject({ error_code: 'INTERNAL_SERVER_ERROR' })
        }
    }

    async isMatchPassword(nonHashValue, hashValue) {
        try {
            let isMatch = await bcrypt.compare(nonHashValue, hashValue);
            return isMatch;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async getAllUser() {
        try {
            let users = await this.db(this.table);
            return users;
        }
        catch (error) {
            console.log(error);
            return Promise.reject(error);
        }
    }
    async getAUser(id) {
        try {
            let user = await this.db(this.table).where({ id }).select(['id','name','phone','address','email','photo']).first();
            return user;
        }
        catch (error) {
            console.log(error);
            return Promise.reject(error);
        }
    }
    async apiUserPasswordCheck(user) {
        try {
            let { email, password } = user;
            let retriveUser = await this.find({ email });
            if (!retriveUser) {
                return Promise.reject({ error_code: 'USER_NOT_FOUND', message: 'Register email is not found.' });
            }
            let isMatchPassword = await bcrypt.compare(password.toString(), retriveUser.password);

            if (!isMatchPassword) {
                return Promise.reject({ error_code: 'INVALID_PASS', message: 'email/Password did not match' });
            }
            else {
                return retriveUser;
            }
        }
        catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }
    


    async generateHash(object, filed) {
        let value;
        let isObject = true;
        if (typeof object !== "object") {
            value = object;
            isObject = false;
        }
        else {
            value = object[filed];
        }
        try {
            let saltRound = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(value.toString(), saltRound);
            let genHash = isObject ? (object[filed] = hash) : hash;
            return isObject ? object : genHash;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
};