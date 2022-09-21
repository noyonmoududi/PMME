require('../system/loader');

class Model {

    constructor() {
        this.db = require('../config/database').instance;
        this.table = ''
        this.primaryKey = 'id';
        this.select = '*';
        this.columnsResponse;
    };
    /**
     * 
     * @param JSON data 
     * @return int
     */
    async save(data) {
        try {
            let insert = await this.db(this.table).insert(data);
            let insertedId = insert[0];
            return insertedId;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * 
     * @param Object conditions 
     * @returns array
     */
    async get(conditions) {
        try {
            let data = null;
            if (conditions && Object.keys(conditions).length > 0) data = this.db(this.table).where(conditions).select(this.select);
            else data = this.db(this.table).select(this.select);
            return Promise.resolve(data);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * 
     * @param object conditions 
     * @param array select_columns 
     * @returns Object
     */
    async find(conditions, select_columns = ['*']) {
        try {
            let data = null;
            data = this.db(this.table).where(conditions).select(select_columns).first();
            return Promise.resolve(data);
        } catch (error) {
            return Promise.reject(error);
        }
    }
    /**
     * 
     * @param Object conditions 
     * @returns object 
     */
    async delete(conditions) {
        try {
            let data = null;
            data = this.db(this.table).where(conditions).del()
            return Promise.resolve(data);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * 
     * @param Object condition 
     * @param Object data 
     * @returns Object
     */
     async update(condition, data) {
        try {
            let res = await this.db(this.table).where(condition).update(data);
            return res;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    /**
     * 
     * @param Object condition 
     * @param Object insert_data 
     * @returns Object
     */
    async firstOrCreate(conditions,insert_data){
        return new Promise(async (resolve,reject)=>{
            try{
                let row = await this.db(this.table).where(conditions).select(this.select).first();
                if(row) return resolve(row)
                else{
                    let insert_id = this.db(this.table).insert(insert_data);
                    row = await this.db(this.table).where({id:insert_id}).select(this.select).first();
                    return resolve(row)
                }
            }catch(err){
                reject(err)
            }
        })
    }

    format_data(data) {
        if (this.columnsResponse) {
            const _format = (_data) => {
                let _json = {};
                for (let key in _data) {
                    if (this.columnsResponse.includes(key)) _json[key] = _data[key];
                }
                return _json;
            }
            if (Array.isArray(data)) {
                let jsons = data.map((d) => {
                    return _format(d)
                })
                return jsons;
            }
            else if (typeof data == 'object') {
                return _format(data)
            } else throw 'Please provide Object/ArrayOfObject';

        } else throw 'columnsResponse property is not set';
    }

}

module.exports = Model;