import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();
const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    polygonAmoy: {
      url: `https://rpc-amoy.polygon.technology`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    baseSepolia: {
      url: `https://sepolia.base.org`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    bnbTestnet: {
      url: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    moonbase: {
      url: `https://rpc.api.moonbase.moonbeam.network`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};

export default config;
