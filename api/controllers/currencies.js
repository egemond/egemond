const mongoose = require("mongoose");
const Currency = mongoose.model("Currency");

const getCurrencies = (req, res) => {
  Currency.find()
    .sort("_id")
    .exec((error, currencies) => {
      if (error) {
        res.status(500).json({
          message: "The data could not be retrieved.",
        });
      } else {
        res.status(200).json(currencies);
      }
    });
};

const getCurrency = (req, res) => {
  let currencyId = req.params.currencyId;
  if (currencyId) {
    Currency.findById(currencyId)
      .exec((error, currency) => {
        if (!currency) {
          res.status(404).json({
            message: "The currency with this identifier doesn't exist.",
          });
        } else if (error) {
          res.status(500).json({
            message: "The data could not be retrieved.",
          });
        } else {
          res.status(200).json(currency);
        }
      });
  } else {
    return res.status(404).json({
      message: "Required parameter missing.",
    });
  }
};

module.exports = {
  getCurrencies,
  getCurrency,
};