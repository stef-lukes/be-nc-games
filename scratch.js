// TESTS =======================

// DELETE /api/comments/:comment_id

// Should: delete the given comment by comment_id

// Responds with: status 204 and no content

describe("11. GET /api/reviews (queries)", () => {});

// 404 - comment_id in path doesn't exist
// 400 - comment_id in path is not a number

// CONTROLLER ===================================================

exports.getAllReviews = (req, res) => {
  fetchAllReviews(req.query).then((reviews) => {
    res.status(200).send({ reviews });
  });
};
// MODEL ==========================================================

exports.fetchAllReviews = (sort_by, orderby, category) => {
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
