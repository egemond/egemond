const mongoose = require("mongoose");

const currencySchema = new mongoose.Schema({
  _id: String,
  symbol: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

mongoose.model("Currency", currencySchema, "Currencies");