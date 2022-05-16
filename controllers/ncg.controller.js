const { fetchAllCategories } = require("../models/ngc.model");

exports.getAllCategories = (req, res) => {
  fetchAllCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};
