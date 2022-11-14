const express = require("express");
const { getCategories } = require("./controllers/games-controller");
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

// error handling
app.get("/*", (req, res) => {
  res.status(404).send({ msg: "invalid path" });
});

app.use((err, req, res, next) => {
  console.log(err, "unhandled error");
  res.status(500).send({ message: "internal server error" });
});

module.exports = app;
