var db = require("../../models/index");

async function getRandomTrendInfo(callback) {

    let response = [];

    for (let i = 0; i < 10; i++) {

        let trend = {};
        let keywordcode = (Math.floor(Math.random() * (13 - 1 + 1)) + 1) * 100;
        let agecode = (Math.floor(Math.random() * (5 - 1 + 1)) + 1) * 10;
        let gendercode = Math.floor(Math.random() * (2 - 1 + 1)) + 1;

        console.log(`keywordcode : ${keywordcode} / agecode : ${agecode} / gendercode : ${gendercode}`);

        let searchOption = {};
        searchOption.keyword = keywordcode; // 100
        searchOption.age = agecode; // 10
        searchOption.gender = gendercode; // 1

        await db.Trend.findOne({ where: searchOption, order: [['count', 'DESC']], attributes: ['iataCode', 'count'] })
            .then((result) => {
                trend.city = result.dataValues.iataCode;
                trend.count = result.dataValues.count;
            }
            );

        //arr에 넣으면? 
        var keywordarr = ['오로라', '유적', '맛집', '문화예술', '마사지', '비치', '산림욕', '플리마켓', '아울렛', '쇼핑', '서핑', '캠핑', '호캉스']
        var agearr = ['10대', '20대', '30대', '40대', '50대']
        var genderarr = ['여성', '남성']

        trend.keyword = keywordarr[(keywordcode / 100) - 1]
        trend.age = agearr[(agecode / 10) - 1]
        trend.gender = genderarr[gendercode - 1]

        /*
        
         response = [{
             city : London
             count : 100 (100번 검색되었다)
             keyword : 쇼핑
             age : 40대
             gender : 남성
        } {} {} {}]
    
        */

        // await db.TrendIndex.findOne({ where: { genderid: gendercode } })
        //     .then((data) => {
        //         trend.gender = data.dataValues.gender
        //     })
        // await db.TrendIndex.findOne({ where: { ageid: agecode } })
        //     .then((data) => {
        //         trend.age = data.dataValues.age
        //     })
        // await db.TrendIndex.findOne({ where: { keywordid: keywordcode } })
        //     .then(data => {
        //         trend.keyword = data.dataValues.keywordkor
        //     })

        response.push(trend);

    }
    /* console.log(response); */
    callback(response);
}

module.exports = { getRandomTrendInfo };