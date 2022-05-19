const { fetchReviewComments, addComment } = require("../models/comments.model");
const { fetchReviewById } = require("../models/reviews.model");
exports.getReviewComments = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewComments(review_id)
    .then((body) => {
      res.status(200).send({ body });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postReviewComment = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewById(review_id)
    .then(() => {
      return addComment(review_id, req.body).then((commentPost) => {
        res.status(201).send({ commentPost });
      });
    })
    .catch((err) => {
      // console.log(err, "<< controller");
      next(err);
    });
};
