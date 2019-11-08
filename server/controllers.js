const express = require('express');
const bodyParser = require('body-parser');
const calculate_model = require('./models/calculate');
const trends_model = require('./models/trends');
const randomtrends_model = require('./models/randomtrends');
const signup_model = require('./models/signup');
const signin_model = require('./models/signin');
const mypage_model = require('./models/mypage');

const getSearchKeyword = function (req, res) {

    const cityCode = req.query.cityCode; //LHR
    const departureDate = req.query.departureDate; //2019-11-01
    const arrivalDate = req.query.arrivalDate; //2019-11-08
    const cityName = req.query.cityName; //London
    /* const stop = req.query.stop; //1 */
    const name = req.query.name;

    const keyword = req.query.code.length === 4 ? req.query.code.slice(0, 2) + '00' : req.query.code.slice(0, 1) + '00';
    const age = req.query.code.slice(-2)[0] + '0';
    const gender = req.query.code.slice(-1);


    var sess = req.session;

    // console.log('<controllers/calculate> keyword 잘 분해되었는지 : ', keyword);
    // console.log('<controllers/calculate> age 잘 분해되었는지 : ', age);
    // console.log('<controllers/calculate> gender 잘 분해되었는지 : ', gender);

    if (!cityCode || !departureDate || !arrivalDate || !cityName || !keyword || !age || !gender) {
        res.sendStatus(400);
    }

    calculate_model.getSearchKeyword(cityCode, departureDate, arrivalDate, cityName, keyword, age, gender, sess, name, (data) => {
        res.status(200).send(data);
    })
};


const getTrendInfo = function (req, res) { // /trends?code=1101&attraction=Museum


    const keyword = req.query.code.length === 4 ? req.query.code.slice(0, 2) + '00' : req.query.code.slice(0, 1) + '00';
    const age = req.query.code.slice(-2)[0] + '0';
    const gender = req.query.code.slice(-1);

    // console.log('<controllers/trends> keyword 잘 분해되었는지 : ', keyword);
    // console.log('<controllers/trends> age 잘 분해되었는지 : ', age);
    // console.log('<controllers/trends> gender 잘 분해되었는지 : ', gender);

    if (!keyword || !age || !gender) {
        res.sendStatus(400);
    }

    const keyword_string = req.query.attraction

    trends_model.getTrendInfo(keyword, age, gender, keyword_string, (data) => {
        res.status(200).send(data);
    })

}

const getRandomTrendInfo = function (req, res) {

    randomtrends_model.getRandomTrendInfo((data) => {
        res.status(200).send(data)
    })

}

const signup = function (req, res) { // id, password, gender, age, keyword
    // /singup?id= &password= & gender= & age= & keyword=

    console.log('controllers signup 들어왔니?');
    console.log('controllers 에서 request 찍어봄', req.body);

    var id = req.body.id;
    var password = req.body.password;
    var gender = req.body.gender;
    var age = req.body.age;
    var keyword = req.body.keyword;

    signup_model.signup(id, password, gender, age, keyword, (boolean) => {
        if (boolean) {
            res.sendStatus(301);
        } else {
            res.status(500).send("이미 존재하는 아이디입니다.");
        }
    })
}


const signin = function (req, res) { // id, password

    console.log('controllers_signin 들어왔니?')
    console.log('controllers_req', req.body);
    var id = req.body.id;
    var password = req.body.password;
    var sess = req.session;
    console.log('controller에서 session', req.session)

    signin_model.signin(id, password, sess, (data) => {

        console.log('singin 의 data 는 뭐니?', data);
        if (data) {
            res.status(200).send(data);
        } else {
            res.status(500).send("아이디 / 패스워드 오류");
        }

    })
}

const signout = function (req, res) {
    console.log('controllers signout req.body ?', req.body);

    let session = req.session;
    console.log('controllers signout 들어왔니 ?');
    console.log('controllers signout 의 session 이 어떻게 생겼니?', session);

    if (session.isLogined) {
        console.log('session.userid 가 있다!');

        session.destroy((err) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                console.log("로그아웃 성공")
                res.sendStatus(200);
            }
        })

    } else {
        res.sendStatus(200);
    }

}

const getUserHistory = function (req, res) {
    /* console.log('getuserhistory / req : ', req); */

    let sess = req.session;
    console.log('getuserhistory / req.session : ', req.session);

    if (req.session.userid) {

        console.log('getuserhistory / req.session / sess.userid 있음! : ', sess.userid);
        let username = sess.userid;
        mypage_model.mypage(username, (data) => {
            res.status(200).send(data);
        })
    } else {
        res.status(500).send("로그인이 필요한 페이지입니다.");
    }
}

module.exports = { getSearchKeyword, getTrendInfo, getRandomTrendInfo, signup, signin, signout, getUserHistory }