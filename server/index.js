const express = require("express");
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const sequelize = require("../models/index").sequelize;
const routes = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "http://3.15.20.155:5000"],
  credentials: true
}));


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
