const { application } = require("express");
const {
  selectCategories,
  selectReviewsCommentCount,
  selectReviewsWithReviewId,
  selectReviewComments,
  insertComment,
  updateVotes,
  selectUsers,
  removeComment,
} = require("../models/games-model");

exports.getCategories = (req, res, next) => {
  selectCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.getReviewsCommentCount = (req, res, next) => {
  const { sort_by, category, order_by } = req.query;

  selectReviewsCommentCount(sort_by, category, order_by).then((reviews) => {
    res.status(200).send({ reviews });
  });
};

exports.getReviewsWithReviewId = (req, res, next) => {
  selectReviewsWithReviewId(req.params.review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
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

exports.postComment = (req, res, next) => {
  insertComment(req.params.review_id, req.body)
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch((err) => next(err));
};

exports.patchReviewVotes = (req, res, next) => {
  updateVotes(req.params.review_id, req.body)
    .then((review) => {
      res.status(201).send(review);
    })
    .catch((err) => next(err));
};

exports.getUsers = (req, res, next) => {
  selectUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.deleteComment = (req, res, next) => {
  removeComment(req.params.comment_id)
    .then((comment) => {
      res.sendStatus(204);
    })
    .catch((err) => next(err));
};
