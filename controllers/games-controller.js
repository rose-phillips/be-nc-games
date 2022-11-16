const { application } = require("express");
const {
  selectCategories,
  selectReviewsCommentCount,
  selectReviewsWithReviewId,
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
