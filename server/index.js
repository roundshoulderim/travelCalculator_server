const express = require("express");
const sequelize = require("../models/index").sequelize;
const routes = require("./routes");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://travel-calculator-client.s3-website.ap-northeast-2.amazonaws.com/"
    ],
    methods: ["GET", "POST"],
    crudentials: true
  })
);

app.use("/", routes);

app.listen(5000, () => {
  console.log("listening on 5000 port");
});

app.get("/", (req, res) => {
  res.send("hello world");
});

sequelize.sync();
