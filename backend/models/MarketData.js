const mongoose = require("mongoose");

const marketDataSchema = new mongoose.Schema({
  prices: [
    {
      time: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  total_volumes: [
    {
      time: { type: String, required: true },
      volume: { type: Number, required: true },
    },
  ],
  market_caps: [
    {
      time: { type: String, required: true },
      amount: { type: Number, required: true },
    },
  ],
  sma: [
    {
      time: { type: String, required: true },
      value: { type: Number, required: true },
    },
  ],
  rsi: [
    {
      time: { type: String, required: true },
      value: { type: Number, required: true },
    },
  ],
  vwap: [
    {
      time: { type: String, required: true },
      value: { type: Number, required: true },
    },
  ],
});

const MarketData = mongoose.model("MarketData", marketDataSchema);

module.exports = MarketData;
