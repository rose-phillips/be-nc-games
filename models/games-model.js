const { enable } = require("../app.js");
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

exports.selectReviewsCommentCount = (
  sort_by = "created_at",
  category,
  order_by = "DESC"
) => {
  const queryValues = [];
  let queryString = `SELECT reviews.*, 
  COUNT(comments.comment_id)::INT AS comment_count 
  FROM reviews 
  LEFT JOIN comments ON comments.review_id = reviews.review_id `;

  if (category) {
    queryValues.push(category);
    queryString += `WHERE category = $1 GROUP BY reviews.review_id ORDER BY ${sort_by} ${order_by}`;
    return db.query(queryString, queryValues).then((result) => {
      return result.rows;
    });
  } else {
    return db
      .query(
        `SELECT reviews.*, 
    COUNT(comments.comment_id)::INT AS comment_count 
    FROM reviews 
    LEFT JOIN comments ON comments.review_id = reviews.review_id GROUP BY reviews.review_id ORDER BY ${sort_by}  ${order_by}`
      )
      .then((result) => {
        return result.rows;
      });
  }
};

exports.selectReviewsWithReviewId = (review_id) => {
  return db
    .query(
      `      
      SELECT reviews.*,
      COUNT(comments.comment_id)::INT AS comment_count 
      FROM reviews 
      LEFT JOIN comments ON comments.review_id = reviews.review_id 
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id;
      `,
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

exports.selectUsers = () => {
  return db
    .query(
      `
      SELECT * FROM users;
    `
    )
    .then((result) => {
      return result.rows;
    });
};

exports.removeComment = (comment_id) => {
  return db.query(
    `DELETE FROM comments 
    WHERE comment_id = $1;`,
    [comment_id]
  );
};
