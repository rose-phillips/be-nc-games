const express = require("express");
const {
  getCategories,
  getReviewsCommentCount,
  getReviewsWithReviewId,
  getReviewComments,
} = require("./controllers/games-controller");
const app = express();

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviewsCommentCount);
app.get("/api/reviews/:review_id", getReviewsWithReviewId);
app.get("/api/reviews/:review_id/comments", getReviewComments);

// error handling
app.get("/*", (req, res) => {
  res.status(404).send({ msg: "invalid path" });
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "internal server error" });
});

module.exports = app;
