const { query } = require("../db/connection");
const db = require("../db/connection");

exports.fetchReviewComments = (review_id) => {
  const dbReq1 = db.query(`SELECT * FROM comments WHERE review_id = $1`, [
    review_id,
  ]);
  const dbReq2 = db.query(`SELECT * FROM reviews WHERE review_id = $1`, [
    review_id,
  ]);

  return Promise.all([dbReq1, dbReq2]).then(([comments, reviews]) => {
    if (reviews.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `Review ${review_id} does not exist`,
      });
    }
    return comments.rows;
  });
};

exports.addComment = (review_id, reqBody) => {
  const commentAuthor = reqBody.username;
  const commentBody = reqBody.body;

  return db
    .query(
      `INSERT INTO comments (body, author, review_id) VALUES ($1, $2, $3) RETURNING *;`,
      [commentBody, commentAuthor, review_id]
    )
    .then((newComment) => {
      return newComment.rows[0];
    });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id =$1;`, [comment_id])
    .then((comments) => {
      if (!comments.rows.length) {
        return Promise.reject({
          status: 404,
          msg: `Comment ID: ${comment_id} does not exist`,
        });
      }
      return db.query(`DELETE FROM comments WHERE comment_id =$1;`, [
        comment_id,
      ]);
    });
};
