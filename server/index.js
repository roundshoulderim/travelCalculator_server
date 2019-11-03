const express = require("express");
const sequelize = require("../models/index").sequelize;
const routes = require("./routes");
const cors = require("cors");

const app = express();

app.use(cors());

app.use("/", routes);

app.listen(5000, () => {
  console.log("listening on 5000 port");
});

app.get("/", (req, res) => {
  res.send("hello world");
});

sequelize.sync();
