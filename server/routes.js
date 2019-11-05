const express = require('express');
const router = express.Router();
const controllers = require('./controllers');

router.get('/calculate', controllers.getSearchKeyword);
router.get('/trends', controllers.getTrendInfo);


module.exports = router;