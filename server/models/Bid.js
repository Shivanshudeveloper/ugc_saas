const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const campaignSchema = new mongoose.Schema({
  campaign: {
    type: Schema.Types.ObjectId,
    ref: "campaign",
    required: true,
  },
  creators: [
    {
      creator: { type: Schema.Types.ObjectId, ref: "creator", required: true },
      // creatorLevel: { type: String, required: true },
      price: { type: Number, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
  winningBid: {
    creator: { type: Schema.Types.ObjectId, ref: "creator" },
    creatorLevel: { type: String },
    price: { type: Number },
    date: { type: Date, default: Date.now },
  },
});

const campaign = mongoose.model("bid", campaignSchema);
module.exports = campaign;
