(async()=>{
    try{
      const cryptoTousdCronJob = require('./cronJob/cryptoToUsdUpdateCronJob');
      // cryto_rate table update cronjob on every 12 houre (standrad japanesse time)
      cryptoTousdCronJob.task.start();

    }
    catch(err){
        console.log(err);
    }
  })();