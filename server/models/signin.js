var db = require("../../models/index");
const crypto = require('crypto');

const signin = function (id, password, session, callback) {

    const secret = 'travel';
    const pass = crypto.createHmac('sha256', secret)
        .update(password)
        .digest('hex');


    /*
// sessionStorage에 데이터 저장
sessionStorage.setItem('key', 'value');

// sessionStorage에서 저장된 데이터 가져옴
var data = sessionStorage.getItem('key');

//객체 통째로 넣을 때 
localStorage.setItem('object', JSON.stringify({ a: 'b' }));
JSON.parse(localStorage.getItem('object')); // { a: 'b' }
    */


    /*
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
    */


    /*

        - calculate 에 들어왔을 때
        - callback 보낸 후에
        - DB.trend 갈 때 쯤, 그 전후로해서
        - DB.userhistroy 에 가서 session 에 들어가있는 username 필드 일치하는 것으로 update 를 한다. (create??)
        - 이 때 create 할 것들은, 유저네임이랑 / 도시 / (de.day, arr.day) / 요약 견적 : estimate (항공 호텔 레스토랑 토탈) / 사진
        

        -----------

        - /mypage
        - session username 확인해서 일치하는 사람의 
        db.userinfo (관심, 성별, 연령대)
        db.userhistory (배열로 쭉 여러개 객체 넣어서 보내주기)

        userhistory
        id  (자동생성)
        username
        cityname
        departuredate
        arrivaldate
        estimate stringify 해서 넣기!!!


        






    */




    db.Userinfo.findOne({ where: { username: id, password: pass } })
        .then(data => {
            console.log('db에서 찾아왔니?', data.dataValues)

            session.isLogined = true;
            session.userid = data.dataValues.username;
            session.keyword = data.dataValues.keyword;
            session.age = data.dataValues.age;
            session.gender = data.dataValues.gender;

            console.log('session 잘 나왔니?', session);
            callback(session)
        }).catch(err => {
            callback(false);
        })

}


module.exports = { signin };