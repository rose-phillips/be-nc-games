const express = require("express");
const {
  getCategories,
  getReviewsCommentCount,
  getReviewsWithReviewId,
  getReviewComments,
  postComment,
} = require("./controllers/games-controller");
const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviewsCommentCount);
app.get("/api/reviews/:review_id", getReviewsWithReviewId);


app.get("/api/reviews/:review_id/comments", getReviewComments);


app.post("/api/reviews/:review_id/comments", postComment);


// error handling
app.all("/*", (req, res) => {
  res.status(400).send({ msg: "invalid path" });
});
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  // handle specific psql errors
  else if (err.code === "23502") {
    res.status(400).send({ msg: "invalid input" });
  } else if (
    err.code === "23503" &&
    err.constraint === "comments_author_fkey"
  ) {
    res.status(404).send({ msg: "user not found" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "not found" });
  } else {
    console.log(err);
    res.status(500).send({ msg: "internal server error" });
  }
});
app.use((err, req, res, next) => {
  res.status(500).send({ message: "internal server error" });
});

module.exports = app;
