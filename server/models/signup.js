var db = require("../../models/index");
const crypto = require('crypto');

const signup = function (id, password, gender, age, keyword, callback) {

    console.log('models signup 들어왔니?');
    console.log('model_id', id);
    const secret = 'travel';
    const pass = crypto.createHmac('sha256', secret)
        .update(password)
        .digest('hex');

    db.Userinfo.findOrCreate({
        where: { username: id },
        defaults: {
            username: id,
            password: pass,
            gender: gender,
            age: age,
            keyword: keyword
        }
    }).then(([user, created]) => {
        if (created) { // 기존 유저중에 없어서 내가 create 했다. true
            callback(true);
        } else { // 원래 있는 유저다. false
            callback(false)
        }
    })
}
module.exports = { signup };

/*
유저 테이블

유저 아이디
ID
PW
나이
성별
관심사


히스토리
유저아이디
검색기록 (파리/3/5)
숙박
항공권
식비
일정
토탈
검색날
*/