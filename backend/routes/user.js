const express = require("express");
const { ethers } = require("ethers");
const router = express.Router();
const abi = require("../abi/erc20.json");
const poolMasterAbi = require("../abi/poolMaster.json");
// Define your routes here

router.get("/wallets", async (req, res) => {
  const auth_token = req.headers.authorization;
  if (!auth_token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

router.post("/depositUSDC", async (req, res) => {
  const { amount, address } = req.body;
  const auth_token = req.headers.authorization;

  if (!auth_token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!amount || !address) {
    return res.status(400).json({ message: "Invalid request" });
  }
  console.log(auth_token);
  const createResponse = await fetch(
    "https://sandbox-api.okto.tech/api/v1/wallet ",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth_token,
      },
    }
  );

  if (createResponse.status !== 200) {
    console.log(await createResponse.text());
    return res.status(400).json({ message: "Failed to create wallet" });
  } else {
    console.log("CREATED");
  }

  const iface = new ethers.Interface(abi);
  const approveData = iface.encodeFunctionData("approve", [
    "0x1b0Dc8e39BF094146187DcDaA96fD75A7027b1F4",
    amount,
  ]);
  console.log(approveData, address);
  const approvalResponse = await fetch(
    "https://sandbox-api.okto.tech/api/v1/rawtransaction/execute",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth_token,
      },
      body: JSON.stringify({
        network_name: "POLYGON_TESTNET_AMOY",
        transaction: {
          from: address,
          to: "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582",
          data: approveData,
          value: "0x0",
        },
      }),
    }
  );

  if (approvalResponse.status !== 200) {
    console.log(await approvalResponse.text());
    return res.status(400).json({ message: "Failed to approve" });
  }
  const pooliface = new ethers.Interface(poolMasterAbi);
  const data = pooliface.encodeFunctionData("mint", [amount]);

  const response = await fetch(
    "https://sandbox-api.okto.tech/api/v1/rawtransaction/execute",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth_token,
      },
      body: JSON.stringify({
        network_name: "POLYGON_TESTNET_AMOY",
        transaction: {
          from: address,
          to: "0x1b0Dc8e39BF094146187DcDaA96fD75A7027b1F4",
          data: data,
          value: "0x0",
        },
      }),
    }
  );
  if (response.status !== 200) {
    console.log(await response.text());
    return res.status(400).json({ message: "Failed to mint" });
  }

  return res.json({ message: "Success" });
});

module.exports = router;
