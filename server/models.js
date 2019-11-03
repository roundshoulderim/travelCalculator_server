var db = require("../models/index");
const fetch = require("node-fetch");
//var accessdata =require('../accessdata');

const getSearchKeyword = function (
  cityCode,
  departure,
  arrival,
  stop,
  cityName,
  callback
) {
  var ama = undefined;
  var amas = undefined;
  var ZOMATO_API_KEY = undefined;

  db.Apikey.findAll()
    .then(data => {
      ama = data[0].dataValues.key;
      amas = data[1].dataValues.key;
      ZOMATO_API_KEY = data[2].dataValues.key;
    })
    .then(() => {
      var response = {};
      response.estimate = {};
      response.details = {};
      response.details.flight = [];
      response.details.hotel = [];
      response.details.restaurant = [];

      // 식비받고
      // 몇박며칠인지 날짜 계산

      function calculus(day1, day2) {
        var sta_ymd_arr = day1.split("-");
        var end_ymd_arr = day2.split("-");
        var sta_ymd_obj = new Date(
          sta_ymd_arr[0],
          Number(sta_ymd_arr[1]) - 1,
          sta_ymd_arr[2]
        );
        var end_ymd_obj = new Date(
          end_ymd_arr[0],
          Number(end_ymd_arr[1]) - 1,
          end_ymd_arr[2]
        );
        var betweenDay =
          (end_ymd_obj.getTime() - sta_ymd_obj.getTime()) / 1000 / 60 / 60 / 24;
        return betweenDay;
      }

      let day = calculus(departure, arrival);
      response.day = day;
      console.log("day!!!!!!!", day);

      let currency = 0;

      // var currencypromise = db.Currency.findOne({
      //     where : {iataCode : cityCode}
      // }).
      // then((data) =>{
      //     currency = data.dataValues.krw;
      //     console.log('currency-------', currency);
      // });

      var mealpromise = db.Meal.findOne({
        where: { iataCode: cityCode }
      }).then(data => {
        currency = data.dataValues.krw;
        response.estimate.restaurant = data.dataValues.onedaymeal;
      });

      var flightpromise = fetch(
        "https://test.api.amadeus.com/v1/security/oauth2/token",
        {
          body: `grant_type=client_credentials&client_id=YgxTJ1tGQDlG3aGH94nAoqCRPqpthHd4&client_secret=${amas.slice(
            0,
            amas.length - 1
          )}`,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: "POST"
        }
      )
        .then(res => res.json())
        .then(data => {
          console.log(data);

          var token = data.access_token;

          // 항공권 코드

          var originLocationCode = "ICN";
          var destinationLocationCode = cityCode;
          var departureDate = departure;
          var returnDate = arrival;
          var currencyCode = "KRW";
          var nonStop = "true"; //직항
          if (Number(stop) !== 0) {
            nonStop = "false"; //경유
          }
          var travelClass = "ECONOMY";
          var max = 100;

          console.log(`https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originLocationCode}
        &destinationLocationCode=${destinationLocationCode}&departureDate=${departureDate}
        &returnDate=${returnDate}&currencyCode=${currencyCode}&adults=1&nonStop=${nonStop}
        &travelClass=${travelClass}&max=${max}`);

          fetch(
            `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originLocationCode}&destinationLocationCode=${destinationLocationCode}&departureDate=${departureDate}&returnDate=${returnDate}&currencyCode=${currencyCode}&adults=1&nonStop=${nonStop}&travelClass=${travelClass}&max=${max}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
            .then(resp => resp.json())
            .then(results => {
              //estimate_flight 평균가격 산정
              let sum = 0;
              let count = parseInt(results.data.length * 0.2);

              if (results.data.length < 10) {
                count = 0;
              }

              for (let i = count; i < results.data.length; i++) {
                sum += Number(results.data[i].price.total);
              }
              var average = sum / (results.data.length - count);
              console.log(
                `[LENGTH] : ${results.data.length} / [COUNT] : ${count}`
              );
              console.log("average-------------", average);
              response.estimate.flight = average;

              //상세페이지 정보 일단 1개만

              for (let i = 0; i <= 2; i++) {
                let body = {};
                body.offerid = i;
                body.itineraries = [];
                body.price = results.data[i].price.total;
                let carrierCode =
                  results.data[i].itineraries[0].segments[0].carrierCode;

                //check!!!!!!
                //db 가서 로고, 항공사 이름 찾아옴
                db.Carrier.findOne({
                  where: { iatacode: carrierCode }
                }).then(data => {
                  console.log(data.dataValues.airline);

                  body.airline = data.dataValues.airline;
                  body.logo = data.dataValues.logo;
                  response.details.flight.push(body);
                });

                // db.Carrier.findOne({
                //     where : {iatacode : 'KE'}
                // }).then((data) =>{
                //     body.test = data.dataValues.airline;

                // })

                let go = {}; // 가는편
                let come = {}; // 오는편
                body.itineraries.push(go);
                body.itineraries.push(come);

                //가는 비행기
                go.duration = results.data[i].itineraries[0].duration;
                go.stop = results.data[i].itineraries[0].segments.length - 1;
                go.segments = [];

                //아래 코드 리팩토링 해야함!

                segment1Data = results.data[i].itineraries[0].segments[0];
                let segment1 = {
                  departure: {
                    city: "Seoul",
                    date: segment1Data.departure.at
                  },
                  arrival: {
                    city: "advanced",
                    date: segment1Data.arrival.at
                  },
                  duration: segment1Data.duration
                };

                go.segments.push(segment1);

                //경유 없을 때
                if (go.stop <= 0) {
                  go.segments[0].arrival = {
                    city: cityName,
                    date: segment1Data.arrival.at
                  };
                }

                if (go.stop > 0) {
                  segment2Data = results.data[i].itineraries[0].segments[1];

                  let segment2 = {
                    departure: {
                      city: "advanced",
                      date: segment2Data.departure.at
                    },
                    arrival: {
                      city: cityName,
                      date: segment2Data.arrival.at
                    },
                    duration: segment2Data.duration
                  };
                  go.segments.push(segment2);
                }

                //오는 비행기
                come.duration = results.data[i].itineraries[1].duration;
                come.stop = results.data[i].itineraries[1].segments.length - 1;
                come.segments = [];

                //경유 있을 때

                segment3Data = results.data[i].itineraries[1].segments[0];
                let segment3 = {
                  departure: {
                    city: cityName,
                    date: segment3Data.departure.at
                  },
                  arrival: {
                    city: "advanced",
                    date: segment3Data.arrival.at
                  },
                  duration: segment3Data.duration
                };

                come.segments.push(segment3);

                if (come.stop <= 0) {
                  come.segments[0].arrival = {
                    city: "Seoul",
                    date: segment3Data.arrival.at
                  };
                }

                if (come.stop > 0) {
                  segment4Data = results.data[i].itineraries[1].segments[1];

                  let segment4 = {
                    departure: {
                      city: "advanced",
                      date: segment4Data.departure.at
                    },
                    arrival: {
                      city: "Seoul",
                      date: segment4Data.arrival.at
                    },
                    duration: segment4Data.duration
                  };
                  come.segments.push(segment4);
                }
              }
            })
            .catch(error => {
              console.log(error);
            });

          // 항공권 끝남

          fetch(
            `https://test.api.amadeus.com/v2/shopping/hotel-offers?cityCode=${cityCode}&roomQuantity=1&adults=2&radius=30&radiusUnit=KM&paymentPolicy=NONE&includeClosed=false&bestRateOnly=true&view=LIGHT&sort=NONE`,
            {
              // Get the cheapest hotel offers in Madrid today with a search radius of 5 Km around the city center. Include all available hotel descriptive content.
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
            .then(res => res.json())
            .then(result => {
              for (let i = 0; i < 3; i++) {
                console.log(result.data[i]);

                if (result.data[i]) {
                  response.details.hotel[i] = {
                    name: result.data[i].hotel.name,
                    rating: result.data[i].hotel.rating,
                    photo:
                      "http://nomad-design-lifestyle-hotel.basel-hotels.net/data/Photos/767x460/7074/707435/707435914.JPEG",
                    price:
                      Number(result.data[i].offers[0].price.total) * currency,
                    address: result.data[i].hotel.address.cityName + ' ' + result.data[i].hotel.address.lines[0],
                    room: result.data[i].offers[0].room.typeEstimated.category.replace(/\_/g, ` `)
                  };
                } else {
                  response.details.hotel[i] = {
                    name: "soyoon",
                    rating: "5",
                    photo:
                      "https://seoimgak.mmtcdn.com/blog/sites/default/files/images/Emirates-Palace.jpg",
                    price: "10000"
                  };
                }
              }

              // 평균값 산정 //

              let total = 0;
              let length = result.data.length;
              result.data.forEach(el => {
                if (Number(el.offers[0].price.total)) {
                  total += Number(el.offers[0].price.total);
                } else {
                  length--;
                }
              });

              response.estimate.hotel = parseInt((total / length) * currency);

              response.estimate.total =
                response.estimate.flight +
                response.estimate.hotel * day +
                response.estimate.restaurant * day;
              callback(response);
            })
            .catch(error => console.log(error));
        })
        .catch(error => {
          console.log(error);
        });

      // 레스토랑 정보 받아오기 //

      var restaurantpromise = fetch(
        `https://developers.zomato.com/api/v2.1/cities?q=${cityName}`,
        {
          headers: {
            Accept: "application/json",
            "User-Key": ZOMATO_API_KEY
          }
        }
      )
        .then(res => res.json())
        .then(result => {
          let id = result.location_suggestions[0].id;
          fetch(
            `https://developers.zomato.com/api/v2.1/search?entity_id=${id}&entity_type=city&count=3&sort=rating&order=desc`,
            {
              headers: {
                Accept: "application/json",
                // "User-Key": "b8cc3b8b0a85afed047f030fb52dc15f"
                "User-Key": ZOMATO_API_KEY
              }
            }
          )
            .then(res => res.json())
            .then(result => {
              for (let i = 0; i < 3; i++) {
                let name = result.restaurants[i].restaurant.name;
                let photo = result.restaurants[i].restaurant.photos
                  ? result.restaurants[i].restaurant.photos[0].photo.thumb_url
                  : "https://www.cdc.gov/features/holidayfoodsafety/holidayfoodsafety_456px.jpg";
                let cuisines = result.restaurants[i].restaurant.cuisines;
                let price =
                  result.restaurants[i].restaurant.average_cost_for_two +
                  " " +
                  result.restaurants[i].restaurant.currency;
                let rating =
                  result.restaurants[i].restaurant.user_rating.aggregate_rating;
                response.details.restaurant[i] = {
                  name: name,
                  photo: photo,
                  cuisines: cuisines,
                  price: price,
                  rating: rating
                };
              }
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));

      //  Promise.all([currencypromise,mealpromise,flightpromise,restaurantpromise])
      //   .then((result) =>{
      //     console.log('promiseall-------', response)
      //     console.log('promiseall-------', result)
      //     response.estimate.total = response.estimate.flight + (response.estimate.hotel * day) + (response.estimate.restaurant * day)
      //     callback(response)

      //   })
    })
    .catch(err => console.log(err));
};

module.exports = { getSearchKeyword };

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
