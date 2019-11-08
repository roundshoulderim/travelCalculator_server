var db = require("../../models/index");
const fetch = require("node-fetch");
//var accessdata =require('../accessdata');

const getSearchKeyword = function (
  cityCode,
  departure,
  arrival,
  cityName,
  keyword,
  age,
  gender,
  sess,
  name,
  callback
) {
  //var ama = undefined;
  console.log('******* calculate 에서의 session 도 궁금해!', sess);
  var AMADEUS_API_KEY = undefined;
  var ZOMATO_API_KEY = undefined;

  console.log(`[response 분해] cityCode : ${cityCode} departure : ${departure} arrival : ${arrival} cityName : ${cityName} keyword : ${keyword} age : ${age} gender : ${gender}`)

  db.Apikey.findAll()
    .then(data => { // DB apikeys 테이블에서 각 API 의 key 정보를 받아온다.
      //ama = data[0].dataValues.key;
      AMADEUS_API_ID = data[0].dataValues.key;
      AMADEUS_API_KEY = data[1].dataValues.key;
      ZOMATO_API_KEY = data[2].dataValues.key;

    })
    .then(() => {
      var response = {}; // response 로 내려줄 object 틀을 잡아준다.
      response.estimate = {};
      response.details = {};
      response.details.flight = [];
      response.details.hotel = [];
      response.details.restaurant = [];

      function calculus(day1, day2) { // 문자열 형태의 2개 날짜 정보를 (ex: "2019-11-02") 가지고 총 몇 박 일정인지를 계산해주는 함수. 
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

      let day = calculus(departure, arrival); // 총 경비 산정을 위해 클라이언트가 보내온 출발일과 도착일이 총 몇 박인지 계산하는 함수.
      response.day = day;
      console.log(`몇 박 며 칠 ? `, day);

      let currency = 0;
      let hotelaverage = 0;
      let historyphoto;

      // var currencypromise = db.Currency.findOne({
      //     where : {iataCode : cityCode}
      // }).
      // then((data) =>{
      //     currency = data.dataValues.krw;
      //     console.log('currency-------', currency);
      // });

      db.Meal.findOne({ // request 의 iataCode (도시별 공항 코드) 정보를 이용하여 DB로부터 여행지별 환율, 식비, 숙박비 정보를 가져온다. (숙박비 정보는 호텔 API 가 호텔 정보를 받아오지 못할 경우 사용한다)
        where: { iataCode: cityCode }
      }).then(data => {
        currency = data.dataValues.krw;
        response.estimate.restaurant = data.dataValues.onedaymeal;
        hotelaverage = data.dataValues.hotel;
        response.cityphoto = data.dataValues.photo;
        historyphoto = data.dataValues.photo;
      });

      // async function flightpromise() {
      //   let flightresult = await fetch({

      //   })
      //   return await flightresult.json
      // }



      var flightpromise = fetch(
        "https://test.api.amadeus.com/v1/security/oauth2/token",
        {
          body: `grant_type=client_credentials&client_id=${AMADEUS_API_ID}&client_secret=${AMADEUS_API_KEY}`,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: "POST"
        }
      )
        .then(res => res.json())
        .then(data => {

          var token = data.access_token;

          // 항공권 코드

          var originLocationCode = 'ICN';
          var destinationLocationCode = cityCode;
          var departureDate = departure;
          var returnDate = arrival;
          var currencyCode = 'KRW';
          // var nonStop = 'true' //직항 
          // if(Number(stop) !== 0 ) {
          //     nonStop = 'false' //경유
          // }
          var travelClass = 'ECONOMY'
          var max = 250;  //일단 직항 정보를 위해 250개 받아온다. 

          console.log(`https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originLocationCode}
          &destinationLocationCode=${destinationLocationCode}&departureDate=${departureDate}
          &returnDate=${returnDate}&currencyCode=${currencyCode}&adults=1
          &travelClass=${travelClass}&max=${max}`)

          fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originLocationCode}&destinationLocationCode=${destinationLocationCode}&departureDate=${departureDate}&returnDate=${returnDate}&currencyCode=${currencyCode}&adults=1&travelClass=${travelClass}&max=${max}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }).then(resp => resp.json())
            .then((results) => {
              console.log(`[항공] [총 data] 결과 없니 설마? `, results.data ? results.data.length : results);

              if (!results.data) {
                console.log('calculate 결과없다구!');
                response.estimate.flight = 1000000;
                response.estimate.nonstopflight = 2000000;

                // response.details.flight[0] = {};
                // response.details.flight[0].offerid = 1;
                // response.details.flight[0].itineraries = []
                // response.details.flight[0].price = 1000000;
                // response.details.flight[0].airline = "대한항공"


                response.details.flight = [
                  {
                    "offerid": 1,
                    "itineraries": [
                      {
                        "duration": "20H 10M",
                        "stop": "0",
                        "segments": [
                          {
                            "departure": {
                              "city": "Seoul",
                              "date": "2019-11-01 23:40:00"
                            },
                            "arrival": {
                              "city": "London",
                              "date": "2019-11-02 21:00:00"
                            },
                            "duration": "13H 10M"
                          }
                        ]
                      },
                      {
                        "duration": "0",
                        "segments": [
                          {
                            "departure": {
                              "city": "London",
                              "date": "2019-11-03 23:40:00"
                            },
                            "arrival": {
                              "city": "Seoul",
                              "date": "2019-11-04 21:00:00"
                            },
                            "duration": "13H 10M"
                          }
                        ]
                      }
                    ],
                    "price": 100000,
                    "airline": "대한항공",
                    "logo": "https://www.airport.kr/fileroot/aac/KAL_logo.pngr"
                  },
                  {
                    "offerid": 2,
                    "itineraries": [
                      {
                        "duration": "20H 10M",
                        "stop": "1",
                        "segments": [
                          {
                            "departure": {
                              "city": "Seoul",
                              "date": "2019-11-01 23:40:00"
                            },
                            "arrival": {
                              "city": "advanced",
                              "date": "2019-11-02 03:00:00"
                            },
                            "duration": "04H 10M"
                          },
                          {
                            "departure": {
                              "city": "advanced",
                              "date": "2019-11-02 03:00:00"
                            },
                            "arrival": {
                              "city": "London",
                              "date": "2019-11-02 21:00:00"
                            },
                            "duration": "13H 10M"
                          }
                        ]
                      },
                      {
                        "duration": "20H 10M",
                        "stop": "1",
                        "segments": [
                          {
                            "departure": {
                              "city": "London",
                              "date": "2019-11-01 23:40:00"
                            },
                            "arrival": {
                              "city": "advanced",
                              "date": "2019-11-02 03:00:00"
                            },
                            "duration": "04H 10M"
                          },
                          {
                            "departure": {
                              "city": "advanced",
                              "date": "2019-11-02 03:00:00"
                            },
                            "arrival": {
                              "city": "Seoul",
                              "date": "2019-11-02 21:00:00"
                            },
                            "duration": "13H 10M"
                          }
                        ]
                      }
                    ],
                    "price": 100000,
                    "airline": "대한항공",
                    "logo": "https://www.airport.kr/fileroot/aac/KAL_logo.pngr"
                  },
                  {
                    "offerid": 3,
                    "itineraries": [
                      {
                        "duration": "20H 10M",
                        "stop": "1",
                        "segments": [
                          {
                            "departure": {
                              "city": "Seoul",
                              "date": "2019-11-01 23:40:00"
                            },
                            "arrival": {
                              "city": "advenced",
                              "date": "2019-11-02 03:00:00"
                            },
                            "duration": "04H 10M"
                          },
                          {
                            "departure": {
                              "city": "advanced",
                              "date": "2019-11-02 03:00:00"
                            },
                            "arrival": {
                              "city": "London",
                              "date": "2019-11-02 21:00:00"
                            },
                            "duration": "13H 10M"
                          }
                        ]
                      },
                      {
                        "duration": "20H 10M",
                        "stop": "1",
                        "segments": [
                          {
                            "departure": {
                              "city": "London",
                              "date": "2019-11-01 23:40:00"
                            },
                            "arrival": {
                              "city": "advanced",
                              "date": "2019-11-02 03:00:00"
                            },
                            "duration": "04H 10M"
                          },
                          {
                            "departure": {
                              "city": "advanced",
                              "date": "2019-11-02 03:00:00"
                            },
                            "arrival": {
                              "city": "Seoul",
                              "date": "2019-11-02 21:00:00"
                            },
                            "duration": "13H 10M"
                          }
                        ]
                      }
                    ],
                    "price": 100000,
                    "airline": "아시아나항공",
                    "logo": "https://www.airport.kr/fileroot/aac/20180904113100184_0.pngr"
                  }
                ];

                if (response.estimate.hotel) { // 호텔 API 로부터 정보를 다 불러와 산정이 완료된 상태라면, 위에서 정리한 항공 정보를 담아 response 를 보낸다.
                  response.estimate.total =
                    response.estimate.flight +
                    response.estimate.hotel * day +
                    response.estimate.restaurant * day;
                  console.log('항공에서 response : ', response);

                  if (response.details.flight.length !== 0) {
                    callback(response);
                  }

                  // 히스토리 데이터 업데이트하기


                  if (name) {
                    db.Userhistory.create({ username: name, departuredate: departure, arrivaldate: arrival, city: cityName, estimate: JSON.stringify(response.estimate), photo: historyphoto });
                  }

                  //트렌드 데이터 업데이트하기

                  db.Trend.findOne({ where: { keyword: keyword, gender: gender, age: age, iataCode: cityName } }) // DB 로부터 해당 조합의 현재 count 수를 찾는다.
                    .then(data => {
                      console.log(`[검색 시 트렌드 DB 업데이트] [조합코드] keyword : ${keyword}, gender : ${gender}, iataCode : ${cityName}`)
                      console.log('[검색 시 트렌드 DB 업데이트] [도시명 및 카운트]', data.dataValues)
                      let count = data.dataValues.count;
                      count = count + 1; // 해당 조합의 현재 count 수에 +1 을 한다.

                      db.Trend.update({ count: count }, { where: { keyword: keyword, gender: gender, age: age, iataCode: cityName } }) // +1 된 count 수를 해당 조합에 업데이트한다.
                    })
                }

              } else { // 데이터가 있다면

                let flightarr = [0, 1, 2];
                let nonstopsum = 0;
                let nonstopcount = 0;

                for (let i = 0; i < results.data.length; i++) {
                  if (results.data[i].itineraries[0].segments.length === 1) {
                    console.log(`[항공] [직항있음!]`);

                    if (flightarr[0] === 0) {
                      flightarr = [i, 0, 1];
                    }
                    nonstopsum += Number(results.data[i].price.total)
                    nonstopcount++
                  }
                }

                nonstopaverage = nonstopsum / nonstopcount;
                response.estimate.nonstopflight = parseInt(nonstopaverage);

                //estimate_flight 평균가격 산정 100개로 하자.
                let sum = 0;
                let length = 100;
                let count = parseInt(length * 0.2);
                //let count = 20;
                // 250 개 다 불러왔을 때 20 ~ 100
                // 한 80 개 불러왔을 때 0 ~ 80
                // 0개 불러왔을 때 0

                let average = 0;
                if (results.data.length !== 0) {
                  if (results.data.length < 100) {
                    count = 0;
                    length = results.data.length;
                  }
                  for (let i = count; i < length; i++) {
                    sum += Number(results.data[i].price.total);
                  }
                  average = sum / (length - count);
                } else {
                  average = 0;
                }
                response.estimate.flight = parseInt(average);


                //상세페이지 정보


                for (let i = 0; i < flightarr.length; i++) {
                  let body = {};
                  index = flightarr[i];
                  body.offerid = i;
                  body.itineraries = [];
                  body.price = results.data[index].price.total;
                  let carrierCode = results.data[index].itineraries[0].segments[0].carrierCode

                  console.log('[항공] [carrierCode] ', carrierCode);
                  //check!!!!!!
                  //db 가서 로고, 항공사 이름 찾아옴
                  db.Carrier.findOne({
                    where: { iatacode: carrierCode }
                  }).
                    then((data) => {

                      console.log(`[항공] [항공사] `, data.dataValues.airline);

                      body.airline = data.dataValues.airline
                      body.logo = data.dataValues.logo;
                      response.details.flight.push(body);

                      if (response.estimate.total && i === 2) {
                        callback(response);
                      }

                    })

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
                  go.duration = results.data[index].itineraries[0].duration;
                  go.stop = results.data[index].itineraries[0].segments.length - 1;
                  go.segments = [];

                  //아래 코드 리팩토링 해야함!

                  segment1Data = results.data[index].itineraries[0].segments[0]
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
                    }
                  }

                  if (go.stop > 0) {
                    segment2Data = results.data[index].itineraries[0].segments[1]

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
                  come.duration = results.data[index].itineraries[1].duration;
                  come.stop = results.data[index].itineraries[1].segments.length - 1;
                  come.segments = [];

                  //경유 있을 때 

                  segment3Data = results.data[index].itineraries[1].segments[0]
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
                    }
                  }

                  if (come.stop > 0) {

                    segment4Data = results.data[index].itineraries[1].segments[1]

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

                if (response.estimate.hotel) { // 호텔 API 로부터 정보를 다 불러와 산정이 완료된 상태라면, 위에서 정리한 항공 정보를 담아 response 를 보낸다.
                  response.estimate.total =
                    response.estimate.flight +
                    response.estimate.hotel * day +
                    response.estimate.restaurant * day;
                  console.log('항공에서 response : ', response);

                  if (response.details.flight.length !== 0) {
                    callback(response);
                  }

                  // 히스토리 데이터 업데이트하기

                  if (name) {

                    db.Userhistory.create({ username: name, departuredate: departure, arrivaldate: arrival, city: cityName, estimate: JSON.stringify(response.estimate), photo: historyphoto });
                  }

                  //트렌드 데이터 업데이트하기

                  db.Trend.findOne({ where: { keyword: keyword, gender: gender, age: age, iataCode: cityName } }) // DB 로부터 해당 조합의 현재 count 수를 찾는다.
                    .then(data => {
                      console.log(`[검색 시 트렌드 DB 업데이트] [조합코드] keyword : ${keyword}, gender : ${gender}, iataCode : ${cityName}`)
                      console.log('[검색 시 트렌드 DB 업데이트] [도시명 및 카운트]', data.dataValues)
                      let count = data.dataValues.count;
                      count = count + 1; // 해당 조합의 현재 count 수에 +1 을 한다.

                      db.Trend.update({ count: count }, { where: { keyword: keyword, gender: gender, age: age, iataCode: cityName } }) // +1 된 count 수를 해당 조합에 업데이트한다.
                    })
                }

              }


            }).catch(error => { console.log(error) });
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

              let photos = [
                "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
                "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1502&q=80",
                "https://images.unsplash.com/photo-1488805990569-3c9e1d76d51c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80"
              ]


              for (let i = 0; i < 3; i++) {

                if (result.data) {
                  console.log(`[호텔] [amadeus response data]`, result.data.length);
                  if (result.data[i]) {
                    response.details.hotel[i] = {
                      name: result.data[i].hotel.name,
                      rating: result.data[i].hotel.rating,
                      photo: photos[i],
                      price:
                        Number(result.data[i].offers[0].price.total) * currency,
                      address: result.data[i].hotel.address.cityName + ' ' + result.data[i].hotel.address.lines[0],
                      room: result.data[i].offers[0].room.typeEstimated ? result.data[i].offers[0].room.typeEstimated.category.replace(/\_/g, ` `) : "contact"
                    };
                  }

                } else {
                  if (response.details.hotel.length === 0) {

                    response.details.hotel[0] = {
                      name: "HILTON HYDE PARK",
                      rating: "4",
                      photo:
                        "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1502&q=80",
                      price: "263702",
                      address: "129 BAYSWATER RD, BAYSWATER W2 4RJ",
                      room: "PREMIUM KINGBED"
                    };
                  }
                }
              }

              // 평균값 산정 //

              if (!result.data) {
                console.log(`[호텔] [API 결과 없음] estimate : 3성급 호텔 평균 가격 ${hotelaverage} 내려드림`);
                response.estimate.hotel = hotelaverage;
                response.estimate.hotelratings = 3;

              } else {

                if (result.data.length === 0) {
                  console.log(`[호텔] [API 결과 없음] estimate : 3성급 호텔 평균 가격 ${hotelaverage} 내려드림`);
                  response.estimate.hotel = hotelaverage;
                  response.estimate.hotelratings = 3;

                } else {

                  let total = 0;
                  let ratings = 0;
                  let length = result.data.length;
                  result.data.forEach(el => {
                    if (Number(el.offers[0].price.total)) {
                      total += Number(el.offers[0].price.total);
                      ratings += Number(el.hotel.rating);
                    } else {
                      length--;
                    }
                  });
                  response.estimate.hotel = parseInt((total / length) * currency);
                  response.estimate.hotelratings = parseInt((ratings / length));
                  console.log(`[호텔] estimate : ${response.estimate.hotelratings}성급 호텔 평균 가격 ${response.estimate.hotel} 내려드림`);

                }


              }

              if (response.estimate.flight) {

                response.estimate.total =
                  response.estimate.flight +
                  response.estimate.hotel * day +
                  response.estimate.restaurant * day;
                console.log('호텔에서 response : ', response);


                if (response.details.flight.length !== 0) {
                  callback(response);
                }


                if (name) {
                  db.Userhistory.create({ username: name, departuredate: departure, arrivaldate: arrival, city: cityName, estimate: JSON.stringify(response.estimate), photo: historyphoto });
                }

                db.Trend.findOne({ where: { keyword: keyword, gender: gender, age: age, iataCode: cityName } })
                  .then(data => {
                    console.log(`[검색 시 트렌드 DB 업데이트] [조합코드] keyword : ${keyword}, gender : ${gender}, iataCode : ${cityName}`)
                    console.log('[검색 시 트렌드 DB 업데이트] [도시명 및 카운트]', data.dataValues)

                    let count = data.dataValues.count;
                    count = count + 1;
                    console.log('count updated : ', count);
                    db.Trend.update({ count: count }, { where: { keyword: keyword, gender: gender, age: age, iataCode: cityName } })
                  })
              }

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
