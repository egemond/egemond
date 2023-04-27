const mongoose = require("mongoose");
const Category = mongoose.model("Category");

const getCategories = (req, res) => {
  Category.find()
    .sort("_id")
    .exec((error, categories) => {
      if (error) {
        res.status(500).json({
          message: "The data could not be retrieved.",
        });
      } else {
        res.status(200).json(categories);
      }
    });
};

module.exports = {
  getCategories,
};