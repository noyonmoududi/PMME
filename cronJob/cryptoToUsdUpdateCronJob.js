const dotenv = require('dotenv');
dotenv.config();
global.Config = require('../config/config');
global.moment = require('moment-timezone');
require('../system/loader');
let cron = require('node-cron');

let priceUpdate= async ()=>{
   try{
        const CurrencyModel = loadModel('CurrencyModel');
        let getCryptoRate =  loadLibrary('getcryptorate');


        let listOfObj=[];
        let allCurrency = await CurrencyModel.db(CurrencyModel.table).select();
        let allsymbols = allCurrency.map(o => o.symbol).join(",");
        if (allsymbols && allCurrency.length > 0) {
        let rate = await getCryptoRate(allsymbols,'USD');
            if (allCurrency.length > 0 ) {
                for (let i = 0; i < allCurrency.length; i++) {
                    const element = allCurrency[i];
                    listOfObj.push({symbol:element.symbol,usd:rate[element.symbol],updated_at: new Date()});
                }
                const updateRes = await CurrencyModel.updateCurrencyRateData(listOfObj);
            }
        }
   } 
   catch(e){
       console.log(e);
       return Promise.reject(e);
   }
}
//const task= cron.schedule('*/10 * * * * *', async() => { // every 10 sec
const task= cron.schedule('0 */12 * * *', async() => {

    try{
        await priceUpdate();
    }
    catch(err){}
  }, {
    scheduled: true,
    timezone: "Asia/Dhaka"
  });
  module.exports = {
      task:task,
      priceUpdate:priceUpdate
  }