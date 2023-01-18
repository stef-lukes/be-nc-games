const express = require("express");
const app = express();
const cors = require("cors");
const { getAllCategories } = require("./controllers/categories.controller");
const {
  getAllReviews,
  getReviewById,
  patchReviewById,
} = require("./controllers/reviews.controller");
const { getAllUsers } = require("./controllers/users.controller");
const {
  getReviewComments,
  postReviewComment,
  deleteCommentById,
} = require("./controllers/comments.controller");
const { getAPI, getAllEndpoints } = require("./controllers/api.controller");

app.use(cors());

app.use(express.json());

app.get("/api", getAllEndpoints);

app.get("/api/categories", getAllCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.patch("/api/reviews/:review_id", patchReviewById);

app.get("/api/reviews", getAllReviews);

app.get("/api/reviews/:review_id/comments", getReviewComments);

app.post("/api/reviews/:review_id/comments", postReviewComment);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getAllUsers);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Endpoint not found." });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Invalid request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "Username does not exist" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
