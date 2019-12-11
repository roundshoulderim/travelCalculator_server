const express = require('express');
const router = express.Router();
const controllers = require('./controllers');

router.get('/calculate', controllers.getSearchKeyword);
router.get('/trends', controllers.getTrendInfo);
router.get('/loading', controllers.getRandomTrendInfo);

router.post('/signup', function (req, res) {
    controllers.signup(req, res)
});
router.post('/signin', function (req, res) {
    console.log("router 들어왔니?");
    controllers.signin(req, res)
});
router.post('/signout', function (req, res) { controllers.signout(req, res) });

router.get('/mypage', controllers.getUserHistory);



module.exports = router;