const { query } = require("../db/connection");
const db = require("../db/connection");

exports.fetchReviewById = (review_id) => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.review_id):: INT AS comment_count 
    FROM reviews 
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id`,
      [review_id]
    )
    .then((review) => {
      if (review.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Review ${review_id} does not exist`,
        });
      }
      return review.rows[0];
    });
};

exports.updateReviewById = (review_id, reqBody) => {
  const reqBodyKey = Object.keys(reqBody)[0];
  if (reqBodyKey !== "inc_votes") {
    return Promise.reject({
      status: 400,
      msg: `${reqBodyKey} is an invalid request property`,
    });
  }

  const voteChange = reqBody.inc_votes;
  return db
    .query(
      "UPDATE reviews SET votes = votes + $2 WHERE review_id = $1 RETURNING *",
      [review_id, voteChange]
    )
    .then((updatedReview) => {
      if (updatedReview.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Review ${review_id} does not exist`,
        });
      }
      return updatedReview.rows[0];
    });
};

exports.fetchAllReviews = () => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.review_id):: INT AS comment_count 
    FROM reviews 
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC`
    )
    .then((reviews) => {
      return reviews.rows;
    });
};
