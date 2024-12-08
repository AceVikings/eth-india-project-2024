const MarketData = require("../models/MarketData");
const getMarketData = async (req, res) => {
  try {
    const url =
      "https://api.coingecko.com/api/v3/coins/matic-network/market_chart?vs_currency=usd&days=10&precision=full";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        headers: {
          accept: "application/json",
          "x-cg-demo-api-key": process.env.COINGECKO_API_KEY,
        },
      },
    });

    if (response.ok) {
      const data = await response.json();
      // console.log(data);
      const prices = data.prices.map(([time, price]) => ({
        time: time.toString(),
        price: price.toString(),
      }));
      const volumes = data.total_volumes.map(([time, volume]) => ({
        time: time.toString(),
        volume: volume.toString(),
      }));
      const market_caps = data.market_caps.map(([time, amount]) => ({
        time: time.toString(),
        amount: amount.toString(),
      }));
      // Moving Average
      const sma = calculateSMA(prices, 5);
      const rsi = calculateRSI(prices);
      const vwap = calculateVWAP(prices, volumes);

      const marketData = new MarketData({
        prices,
        total_volumes: volumes,
        market_caps,
        sma,
        rsi,
        vwap,
      });
      await marketData.save();

      console.log({ sma, rsi, vwap });
      return { sma, rsi, vwap };
    }
  } catch (error) {
    console.log(error);
  }
};

const calculateSMA = (prices, period) => {
  let sma = [];
  console.log(prices);
  for (let i = period - 1; i < prices.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += parseFloat(prices[i - j].price);
    }
    sma.push({ time: prices[i].time, value: (sum / period).toString() });
  }
  return sma;
};

const calculateRSI = (prices, period = 14) => {
  let gains = 0;
  let losses = 0;
  for (let i = 1; i <= period; i++) {
    const change =
      parseFloat(prices[i].price) - parseFloat(prices[i - 1].price);
    if (change > 0) {
      gains += change;
    } else {
      losses -= change;
    }
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  let rsi = [];
  for (let i = period + 1; i < prices.length; i++) {
    const change =
      parseFloat(prices[i].price) - parseFloat(prices[i - 1].price);
    if (change > 0) {
      avgGain = (avgGain * (period - 1) + change) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = (avgLoss * (period - 1) - change) / period;
    }
    const rs = avgGain / avgLoss;
    rsi.push({
      time: prices[i].time,
      value: (100 - 100 / (1 + rs)).toString(),
    });
  }
  return rsi;
};

const calculateVWAP = (prices, volumes) => {
  let vwap = [];
  let cumulativeVolume = 0;
  let cumulativePriceVolume = 0;
  for (let i = 0; i < prices.length; i++) {
    cumulativeVolume += parseFloat(volumes[i].volume);
    cumulativePriceVolume +=
      parseFloat(prices[i].price) * parseFloat(volumes[i].volume);
    vwap.push({
      time: prices[i].time,
      value: (cumulativePriceVolume / cumulativeVolume).toString(),
    });
  }
  return vwap;
};
module.exports = {
  getMarketData,
};
