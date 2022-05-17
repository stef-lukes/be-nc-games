const db = require("../db/connection");

exports.fetchReviewById = (review_id) => {
  return db
    .query("SELECT * FROM reviews WHERE review_id = $1", [review_id])
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Review ${review_id} does not exist`,
        });
      }
      return response.rows[0];
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
