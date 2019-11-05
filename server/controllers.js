const calculate_model = require('./models/calculate');
const trends_model = require('./models/trends');

const getSearchKeyword = function (req, res) {
    //console.log(req.query)

    const cityCode = req.query.cityCode; //LHR
    const departureDate = req.query.departureDate; //2019-11-01
    const arrivalDate = req.query.arrivalDate; //2019-11-08
    const cityName = req.query.cityName; //London
    /* const stop = req.query.stop; //1 */

    const keyword = req.query.code.length === 4 ? req.query.code.slice(0, 2) + '00' : req.query.code.slice(0, 1) + '00';
    const age = req.query.code.slice(-2)[0] + '0';
    const gender = req.query.code.slice(-1);

    console.log('<controllers/calculate> keyword 잘 분해되었는지 : ', keyword);
    console.log('<controllers/calculate> age 잘 분해되었는지 : ', age);
    console.log('<controllers/calculate> gender 잘 분해되었는지 : ', gender);

    if (!cityCode || !departureDate || !arrivalDate || !cityName || !keyword || !age || !gender) {
        res.sendStatus(400);
    }

    calculate_model.getSearchKeyword(cityCode, departureDate, arrivalDate, cityName, keyword, age, gender, (data) => {
        res.status(200).send(data);
    })
};


const getTrendInfo = function (req, res) { // /trends?code=1101&attraction=Museum


    const keyword = req.query.code.length === 4 ? req.query.code.slice(0, 2) + '00' : req.query.code.slice(0, 1) + '00';
    const age = req.query.code.slice(-2)[0] + '0';
    const gender = req.query.code.slice(-1);

    console.log('<controllers/trends> keyword 잘 분해되었는지 : ', keyword);
    console.log('<controllers/trends> age 잘 분해되었는지 : ', age);
    console.log('<controllers/trends> gender 잘 분해되었는지 : ', gender);

    if (!keyword || !age || !gender) {
        res.sendStatus(400);
    }

    const keyword_string = req.query.attraction

    trends_model.getTrendInfo(keyword, age, gender, keyword_string, (data) => {
        res.status(200).send(data);
    })

}


module.exports = { getSearchKeyword, getTrendInfo }