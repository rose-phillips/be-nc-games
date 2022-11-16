const db = require("../db/connection.js");
const { createRef } = require("../db/seeds/utils.js");

exports.selectCategories = () => {
  return db
    .query(
      `
    SELECT * FROM categories;
    `
    )
    .then((result) => {
      return result.rows;
    });
};

exports.selectReviewsCommentCount = () => {
  return db
    .query(
      `
      SELECT reviews.*, 
      COUNT(comments.comment_id) AS comment_count 
      FROM reviews 
      LEFT JOIN comments ON comments.review_id = reviews.review_id 
      GROUP BY reviews.review_id 
      ORDER BY created_at DESC;

    `
    )
    .then((result) => {
      return result.rows;
    });
};

exports.selectReviewsWithReviewId = (review_id) => {
  return db
    .query(
      `SELECT * FROM reviews
    WHERE review_id = $1`,
      [review_id]
    )
    .then((reviews) => {
      if (!reviews.rows[0]) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        return reviews.rows[0];
      }
    });
};
