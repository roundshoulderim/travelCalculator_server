var db = require("../../models/index");
const request = require("request");
const converter = require("convert-array-to-csv");

const getTrendInfo = function (keyword, age, gender, keyword_string, callback) {

    let searchOption = {};
    searchOption.keyword = keyword;

    if (Number(age)) {
        searchOption.age = age;
    }
    if (Number(gender)) {
        searchOption.gender = gender;
    }

    db.Trend.findAll({ where: searchOption, order: [['count', 'DESC']], attributes: ['iataCode', 'count'] })
        .then(result => {
            var trend = {};
            trend.city = result[0].dataValues.iataCode
            trend.count = result[0].dataValues.count;

            let countSum = 0;

            for (let i = 0; i < result.length; i++) {
                countSum += result[i].dataValues.count;
            }

            trend.ratio = parseInt((trend.count / countSum) * 100);



            //사진 api 
            db.Apikey.findOne({ where: { api: "googlekey" } })
                .then(data => {

                    var GOOGLE_KEY = data.dataValues.key

                    console.log(GOOGLE_KEY);

                    const option = {
                        query: `${keyword_string}+in+${trend.city}`, // 키워드 in 도시
                        key: GOOGLE_KEY
                    };
                    request.get(
                        {
                            uri: "https://maps.googleapis.com/maps/api/place/textsearch/json?",
                            qs: option
                        },
                        function (err, res, body) {
                            if (err) {
                                console.log(err);
                            }

                            let json = JSON.parse(body); //json으로 파싱
                            console.log(json);
                            var arr = [];
                            var arr2 = [];
                            for (let i = 0; i < json.results.length; i++) {
                                arr.push(json.results[i].name);
                                json.results[i].types.forEach(el => {
                                    arr2.push(el);
                                });
                            }
                            //  console.log(arr, arr2);

                            let spots = arr.slice();
                            trend.spot = spots.map(el => el = { text: el, value: 1 });

                            arr = arr.toString().split(" ");
                            /*  console.log("가공 후", arr);
                             console.log(
                                 "가공 후",
                                 arr2
                                     .toString()
                                     .replace(/_/g, ", ")
                                     .split(", ")
                             ); */
                            var word = [];
                            var obj = arr2.reduce((acc, cur) => {
                                if (acc[cur]) {
                                    acc[cur]++;
                                } else {
                                    acc[cur] = 1;
                                }
                                return acc;
                            }, {});
                            /*  console.log("여기!!", obj); */
                            for (let value in obj) {
                                word.push({ text: value, value: obj[value] });
                            }
                            trend.word = word;
                            /* console.log(word)
 */
                            console.log('[트렌드 response]', trend);
                            callback(trend)
                        }
                    );

                })
        })
}

// keyword, age, gender 중 0 이 있으면 우선 where 에 안들어가고
// 0 이 아닌 것들만 where 를 이용하여 DB 에서 꺼내온다.

// orderby 로 가능하면 result 중에서 가장 상위 (도시) 를 꺼내오고
// 그 도시 + keyword 가지고 api 요청을 보낸다.
// .then 으로 받은 결과를 가공하여 callback 에 함꼐 보낸다.

/*

city : english
array : response 가공된것 (쓰신 function 그대로 쓰기)
count : 숫자


*/



module.exports = { getTrendInfo };