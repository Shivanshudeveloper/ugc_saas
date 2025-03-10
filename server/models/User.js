const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const campaignSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  userType: {
    type: String,
    default: "brand",
  },
  name: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  email: {
    type: String,
    // required: true,
    // unique: true,
  },
  funds: {
    currency: {
      type: String,
      default: "USD",
    },
    amount: {
      type: Number,
      default: 0,
    },
    selectedCurrency: {
      type: String,
      default: "USD",
    },
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const campaign = mongoose.model("user", campaignSchema);
module.exports = campaign;
