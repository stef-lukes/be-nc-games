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
