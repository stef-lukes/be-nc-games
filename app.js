const express = require("express");
const app = express();
const { getAllCategories } = require("./controllers/categories.controller");
const { getReviewById } = require("./controllers/reviews.controller");
app.use(express.json());

app.get("/api/categories", getAllCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Endpoint not found." });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid request" });
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
