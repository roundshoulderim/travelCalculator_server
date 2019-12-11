const express = require("express");
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const sequelize = require("../models/index").sequelize;
const routes = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

var whitelist = ['http://localhost:3000', 'http://travel-calculator-client.s3-website.ap-northeast-2.amazonaws.com'];
app.use(cors({ credentials: true, origin: whitelist }));

app.use(function (req, res, next) {
  var allowedOrigins = ['http://localhost:3000', 'http://travel-calculator-client.s3-website.ap-northeast-2.amazonaws.com', 'http://localhost:3000/', 'http://travel-calculator-client.s3-website.ap-northeast-2.amazonaws.com/'];
  var origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
});

// app.all('/*', function (req, res, next) {
//   res.header(
//     'Access-Control-Allow-Origin',
//     'http://travel-calculator-client.s3-website.ap-northeast-2.amazonaws.com'
//   );
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Content-Type, Authorization, Content-Length, X-Requested-With'
//   );
//   console.log(res.getHeaders());
//   next();
// });

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
