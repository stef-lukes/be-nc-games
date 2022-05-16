const express = require("express");
const app = express();
const { getAllCategories } = require("./controllers/ncg.controller");

app.get("/api/categories", getAllCategories);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Bad request: 404! Endpoint not found." });
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
