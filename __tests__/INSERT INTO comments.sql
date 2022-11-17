INSERT INTO comments 
(
  review_id, author, body
)
VALUES
(
  1, 'dav3rid', 'hello'
)
RETURNING author, body;