const express = require("express");
const app = express();

app.use(express.json());

// error handling
app.get("/*", (req, res) => {
  res.status(404).send({ message: "invalid path" });
});

app.use((err, req, res, next) => {
  console.log(err, "unhandled error");
  res.status(500).send({ message: "internal server error" });
});

module.exports = app;
