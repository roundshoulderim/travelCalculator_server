var db = require("../../models/index");

async function mypage(username, callback) {

    let myinfo = {};

    await db.Userinfo.findOne({ where: { username: username } })
        .then(data => {
            console.log('유저인포 data', data);
            myinfo.username = data.dataValues.username;
            myinfo.age = data.dataValues.age;
            myinfo.gender = data.dataValues.gender;
            myinfo.keyword = data.dataValues.keyword;
            myinfo.histories = [];
        })

    await db.Userhistory.findAll({ where: { username: username } })
        .then(data => {
            if (data) {
                console.log('유저히스토리 data', data);

                for (let i = 0; i < data.length; i++) {
                    let history = {};

                    history.departuredate = data[i].dataValues.departuredate;
                    history.arrivaldate = data[i].dataValues.arrivaldate;
                    history.city = data[i].dataValues.city;
                    history.estimate = data[i].dataValues.estimate;
                    history.photo = data[i].dataValues.photo;

                    myinfo.histories.push(history)
                }
            }
        })
    console.log('myinfo 내려드림 !', myinfo);
    callback(myinfo);
}

module.exports = { mypage };