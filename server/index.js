const express = require("express");
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const sequelize = require("../models/index").sequelize;
const routes = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors({
  credentials: true
}));

app.all('/*', function (req, res, next) {
  res.header(
    'Access-Control-Allow-Origin',
    'http://3.15.20.155:5000',
    'http://localhost:3000'
  );
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With'
  );
  console.log(res.getHeaders());
  next();
});

app.use(bodyParser.json());
app.use(session({
  secret: '@travelcalculator',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));

app.use("/", routes);

app.listen(5000, () => {
  console.log("listening on 5000 port");
});

app.get("/", (req, res) => {
  console.log('landingpage 세션 나오니?------------------', req.session)
  res.send("hello world");
});

sequelize.sync();
