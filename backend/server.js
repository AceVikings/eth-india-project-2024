const express = require("express");
const { Coinbase, Wallet } = require("@coinbase/coinbase-sdk");
const { LIT_NETWORK } = require("@lit-protocol/constants");
const LitJsSdk = require("@lit-protocol/lit-node-client-nodejs");
const authRouter = require("./routes/auth");
const dotenv = require("dotenv");
dotenv.config();
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
};
