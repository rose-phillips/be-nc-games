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
