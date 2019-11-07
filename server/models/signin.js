var db = require("../../models/index");
const crypto = require('crypto');

const signin = function (id, password, session, callback) {

    const secret = 'travel';
    const pass = crypto.createHmac('sha256', secret)
        .update(password)
        .digest('hex');

    db.Userinfo.findOne({ where: { username: id, password: pass } })
        .then(data => {
            console.log('db에서 찾아왔니?', data.dataValues)

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