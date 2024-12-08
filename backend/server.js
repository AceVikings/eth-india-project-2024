const express = require("express");
const { Coinbase, Wallet } = require("@coinbase/coinbase-sdk");
const { LIT_NETWORK } = require("@lit-protocol/constants");
const LitJsSdk = require("@lit-protocol/lit-node-client-nodejs");
const authRouter = require("./routes/auth");
const dotenv = require("dotenv");
const cron = require("node-cron");
const db = require("./configs/db");
const { analyseData } = require("./agents/analyse");
const { getMarketData } = require("./agents/fetchData");
dotenv.config();
db();

const cors = require("cors");

const app = express();
const port = process.env.PORT || 3004;

// Middleware
app.use(express.json());
app.use(cors());
app.use("/auth", authRouter);
// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start server
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  await constructor();
});

const constructor = async () => {
  await getMarketData();
  console.log(await analyseData());
  cron.schedule("*/5 * * * *", async () => {
    console.log("Running a task every 5 minutes");
    await getMarketData();
    console.log(await analyseData());
  });
  app.locals.litNodeClient = new LitJsSdk.LitNodeClientNodeJs({
    alertWhenUnauthorized: false,
    litNetwork: LIT_NETWORK.Datil,
    debug: false,
  });
  await app.locals.litNodeClient.connect();

  Coinbase.configureFromJson({
    filePath: "./cdp_api_key.json",
  });

  let wallet = await Wallet.create();
  //   console.log(await wallet.createAddress());
  const accounts = await wallet.getDefaultAddress();

  console.log(accounts);
  // await getMarketData();
};
