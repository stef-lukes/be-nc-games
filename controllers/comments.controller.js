const { fetchReviewComments } = require("../models/comments.model");

exports.getReviewComments = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewComments(review_id)
    .then((comments) => {
      console.log(comments);
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
