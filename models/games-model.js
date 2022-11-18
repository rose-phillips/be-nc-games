const db = require("../db/connection.js");

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

exports.selectReviewComments = (review_id) => {
  return db
    .query(
      `
    SELECT * FROM comments
    WHERE review_id = $1;
    `,
      [review_id]
    )
    .then((comments) => {
      return comments.rows;
    });
};

exports.insertComment = (review_id, { username, body }) => {
  return db
    .query(
      `
      INSERT INTO comments 
      (
        review_id, author, body
      )
      VALUES
      (
        $1, $2, $3
      )
      RETURNING *;
      `,
      [review_id, username, body]
    )
    .then((newComment) => {
      return newComment.rows[0];
    });
};

exports.updateVotes = (review_id, { inc_votes }) => {
  return db
    .query(
      `
  UPDATE reviews
  SET 
  votes = votes + $2
  WHERE review_id = $1
  RETURNING *;
  `,
      [review_id, inc_votes]
    )
    .then((updatedReview) => {
      if (!updatedReview.rows[0]) {
        return Promise.reject({ status: 404, msg: "not found" });
      }

      return updatedReview.rows[0];
    });
};
