const express = require("express");
const sequelize = require('../models/index').sequelize;

const app = express();

app.listen(3000,()=>{
    console.log('listening on 3000 port')
})

app.get('/',(req,res)=>{
    res.send('hello world')
})

sequelize.sync();

/*
var usersRouter = require('./routes/users');
var sequelize = require('./models/index').sequelize;
var app = express();
sequelize.sync();
*/