const fs = require("fs");

exports.getAllEndpoints = (req, res, next) => {
  return fs.readFile("./endpoints.json", "utf8", function (err, data) {
    if (err) throw err;
    res.status(200).send(JSON.parse(data));
  });
};
