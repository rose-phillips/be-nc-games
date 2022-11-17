const { application } = require("express");
const {
  selectCategories,
  selectReviewsCommentCount,
  selectReviewsWithReviewId,
  selectReviewComments,
} = require("../models/games-model");

exports.getCategories = (req, res, next) => {
  selectCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.getReviewsCommentCount = (req, res, next) => {
  selectReviewsCommentCount().then((reviews) => {
    res.status(200).send({ reviews });
  });
};

exports.getReviewsWithReviewId = (req, res, next) => {
  selectReviewsWithReviewId(req.params.review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
exports.getReviewComments = (req, res, next) => {
  selectReviewComments(req.params.review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => next(err));
};
