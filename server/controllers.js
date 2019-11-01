const models = require('./models');

const getSearchKeyword = function(req, res) {
    console.log(req.query)

    const cityCode = req.query.cityCode; //LHR
    const departureDate = req.query.departureDate; //2019-11-01
    const arrivalDate = req.query.arrivalDate; //2019-11-08
    const stop = req.query.stop; //1
    const cityName = req.query.cityName; //London
    
    models.getSearchKeyword(cityCode, departureDate, arrivalDate, stop, cityName)
        // if(err) {
        //     res.status(500).send(err);
        // }
        // res.status(200).send(results);

   };

   module.exports = {getSearchKeyword}