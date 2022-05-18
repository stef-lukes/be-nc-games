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
    } else {
      if (comments.rows.length === 0) {
        return Promise.reject({
          status: 200,
          msg: `Review ${review_id} has no comments`,
        });
      }
      return comments.rows;
    }
  });
};
