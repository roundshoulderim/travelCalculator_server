var db = require("../models/index");
const fetch = require("node-fetch");
var accessdata =require('../accessdata');

const getSearchKeyword = function(cityCode, departure, arrival, stop, cityName) {

console.log("실행됐니?")
    var response = {};
    response.estimate = {};
    response.details = {};
    response.details.flight = [];
    response.details.hotel = [];
    response.details.restaurant = [];

    // 식비받고
    // 몇박며칠인지 날짜 계산

    
    var clientId = accessdata.AMADEUS_API_KEY;
    var clientSecret = accessdata.AMADEUS_API_SECRET;
    fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
        body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
        headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
        method: "POST"
    })
    .then(res => res.json())
    .then(data => {
        var token = data.access_token;
        console.log('token--------', token)
    

        // 항공권 코드

        var originLocationCode = 'ICN';
        var destinationLocationCode = cityCode;
        var departureDate = departure;
        var returnDate = arrival;
        var currencyCode = 'KRW';
        var nonStop = 'true' //직항
        if(Number(stop) !== 0 ) {
            nonStop = 'false' //경유
        }
        var travelClass = 'ECONOMY'
        var max = 100;

        console.log(`https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originLocationCode}
        &destinationLocationCode=${destinationLocationCode}&departureDate=${departureDate}
        &returnDate=${returnDate}&currencyCode=${currencyCode}&adults=1&nonStop=${nonStop}
        &travelClass=${travelClass}&max=${max}`)

        fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originLocationCode}&destinationLocationCode=${destinationLocationCode}&departureDate=${departureDate}&returnDate=${returnDate}&currencyCode=${currencyCode}&adults=1&nonStop=${nonStop}&travelClass=${travelClass}&max=${max}`, 
        {
        headers: {
            Authorization: `Bearer ${token}`
        }
        }).then(resp => resp.json())
        .then((results) =>{

console.log('results.data----------', results)
            //estimate_flight 평균가격 산정
            let sum=0;
            for(let i=20; i<results.data.length; i++){
              sum += Number(results.data[i].price.total);
            }
            var average = sum/(results.data.length-20);
            console.log('average-------------', average);
            response.estimate.flight = average;



            //상세페이지 정보 일단 1개만

            let body = {};
            body.offerid = 1;
            body.itineraries = [];
            body.price = results.data[0].price.total;
            let carrierCode = results.data[0].itineraries[0].segments[0].carrierCode 
            
            //db 가서 로고, 항공사 이름 찾아옴
            db.Carrier.findOne({
                where : {iatacode : carrierCode}
            }).
            then((data) =>{ 
                body.airline = data.airline
                body.logo = data.logo 
            })


            let go = {}; // 가는편
            let come = {}; // 오는편
            body.itineraries.push(go);
            body.itineraries.push(come);

            //가는 비행기
            go.duration = results.data[0].itineraries[0].duration;
            go.stop = results.data[0].itineraries[0].segments.length-1;
            go.segments = [];

            //아래 코드 리팩토링 해야함!
            //경유 있을 때 
            if(go.stop>0) {
            let segment1 = {};
            segment1Data = results.data[0].itineraries[0].segments[0]
            segment1.departure = {};
            segment1.departure.city = "Seoul", //공항코드 통해서 변환? 
            segment1.departure.date = segment1Data.departure.at;
            segment1.arrival = {};
            segment1.arrival.city = "advanced",
            segment1.arrival.date = segment1Data.arrival.at;
            segment1.duration = segment1Data.duration;
            go.segments.push(segment1);


            let segment2 = {};
            segment2Data = results.data[0].itineraries[0].segments[1]
            segment2.departure = {};
            segment2.departure.city = "advanced", 
            segment2.departure.date = segment2Data.departure.at;
            segment2.arrival = {};
            segment2.arrival.city = cityName, 
            segment2.arrival.date = segment2Data.arrival.at;
            segment2.duration = segment2Data.duration;
            go.segments.push(segment2);
            } 

            //경유 없을 때 
            else if(go.stop<=0) { 
            let segment1 = {};
            segment1Data = results.data[0].itineraries[0].segments[0]
            segment1.departure = {};
            segment1.departure.city = "Seoul", //공항코드 통해서 변환? 
            segment1.departure.date = segment1Data.departure.at;
            segment1.arrival = {};
            segment1.arrival.city = cityName,
            segment1.arrival.date = segment1Data.arrival.at;
            segment1.duration = segment1Data.duration;
            go.segments.push(segment1);

            }


            //오는 비행기
            come.duration = results.data[0].itineraries[1].duration;
            come.stop = results.data[0].itineraries[1].segments.length-1;
            come.segments = [];

            //경유 있을 때 
            if(come.stop>0) {
            let segment3 = {};
            segment3Data = results.data[0].itineraries[1].segments[0]
            segment3.departure = {};
            segment3.departure.city = "Seoul", 
            segment3.departure.date = segment3Data.departure.at;
            segment3.arrival = {};
            segment3.arrival.city = "advanced", 
            segment3.arrival.date = segment3Data.arrival.at;
            segment3.duration = segment3Data.duration;
            come.segments.push(segment3);

            let segment4 = {};
            segment4Data = results.data[0].itineraries[1].segments[1]
            segment4.departure = {};
            segment4.departure.city = "advanced", 
            segment4.departure.date = segment4Data.at;
            segment4.arrival = {};
            segment4.arrival.city = cityName, 
            segment4.arrival.date = segment4Data.at;
            segment4.duration = segment4Data.duration;
            come.segments.push(segment4);
            }

            //경유 없을 때 
            else if(come.stop<=0){

            let segment3 = {};
            segment3Data = results.data[0].itineraries[1].segments[0]
            segment3.departure = {};
            segment3.departure.city = cityName, 
            segment3.departure.date = segment3Data.departure.at;
            segment3.arrival = {};
            segment3.arrival.city = "Seoul", 
            segment3.arrival.date = segment3Data.arrival.at;
            segment3.duration = segment3Data.duration;
            come.segments.push(segment3);
            }

            response.details.flight.push(body);
            return response;

            }).catch(error =>{console.log(error)});

            // 항공권 끝남

            
}).catch(error =>{console.log(error)});


}

module.exports = {getSearchKeyword}

/* 

let a = fetch("").then.then
let b = fetch("").then.then
promise.all([a,b]).then()


promise all [항공패치, 호텔패치, 식당데이터베이스다녀오기] . total 계산
estimate : 

=> response 할 객체
--- 준 글로벌 ---

let resposne = {estimate: , detail: }
let nights = 3

-------

[변수1] 토큰을 받는다. > estimate, detail
fetch then 안에서 (항공과, 호텔을 fetch 받는다.)

- response.estimate.flight = 100개 결과;
- response.detail.flights[0], [1], [2] = >

- 호텔 게산해서 넣고


[변수2] 레스토랑 정보 받는다. > detail

- 레스토랑은 그냥 넣고

[변수3] 식비 DB 다녀온다. > estimate

- 그냥 받아와서 계산해서 넣고. (날짜가 필요함...)

return Promise.all([변수1, 변수2, 변수3]).then(estimate.total = estimate.flight + estimate:res + estimate.hotel; return response)


*/

// var apiRequest1 = fetch('api.example1.com/search').then(function(response){ 
//     return response.json()
// });
// var apiRequest2 = fetch('api.example2.com/search').then(function(response){
//     return response.json()
// });
// var combinedData = {"apiRequest1":{},"apiRequest2":{}};
// Promise.all([apiRequest1,apiRequest2]).then(function(values){
// combinedData["apiRequest1"] = values[0];
// combinedData["apiRequest2"] = values[1];
// return combinedData;
// });


/*
[항공]
- estimate 산정
- details 항공일정 제공
<추가 설명>
offerid 3개별로
-itineraries.duration : 총 걸린 시간
-itineraries.stop : 경유 횟수
-itineraries.segments[0].departure = 출발지,출발시간
-itineraries.segments.[0,경유있으면1].arrival = 도착지,도착시간
-airline : 항공사
-price : 가격

[호텔]
- estimate 산정
- details 호텔정보 제공

[식비]
- estimate 산정 (DB이용)
- details 식당정보 제공

*/







