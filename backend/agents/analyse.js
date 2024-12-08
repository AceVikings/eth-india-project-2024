const MarketData = require("../models/MarketData");
const { ChatOpenAI } = require("@langchain/openai");
const dotenv = require("dotenv");
dotenv.config();
const chatOpenAI = new ChatOpenAI({
  apiKey: process.env.OPENAI_KEY,
  model: "gpt-4o-mini",
});

const analyseData = async () => {
  // Find the latest document
  const latestMarketData = await MarketData.findOne().sort({ _id: -1 });

  if (!latestMarketData) {
    console.log("No market data found.");
    return;
  }

  const response = await chatOpenAI.invoke([
    {
      role: "system",
      content: `You're a crypto analysis bot and you've been given 
            the latest market data. You have access to a crypto pool with USDC
            and Polygon the data for which is as follows. Decice if you would hold, or /
            rebalance the pool. If you choose rebalance, provide the new weights for the pool. Return response as percentage weights in the given format, do not explain yourself just return the output as required: {
            "USDC": 0.5,
            "Polygon": 0.5}
            Date:
            ${latestMarketData.toString()}`,
    },
  ]);

  return response.content;
};

module.exports = {
  analyseData,
};
