import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-contract-sizer";
import "hardhat-gas-reporter";
import "hardhat-ignore-warnings"; // mainly for test uniswap contracts

import dotenv from "dotenv";
dotenv.config();

const reportGas = process.env.REPORT_GAS?.toLowerCase() === "true";
const reportSize = process.env.REPORT_SIZE?.toLowerCase() === "true";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 80,
          },
          viaIR: true,
        },
      },
      {
        version: "0.6.12", // uniswapV2 Router
        settings: {
          optimizer: {
            enabled: true,
            runs: 80,
          },
        },
      },
      {
        version: "0.5.16", // @uniswap/v2-core
      },
    ],
  },

  networks: {
    hardhat: {
      accounts: {
        mnemonic: process.env.WALLET_MNEMONIC,
      },
    },
    local: {
      url: process.env.LOCAL_RPC_URL,
      chainId: 31337,
      accounts: {
        mnemonic: process.env.WALLET_MNEMONIC,
      },
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: {
        mnemonic: process.env.WALLET_MNEMONIC,
      },

      initialBaseFeePerGas: 2500000000,
      chainId: 11155111,
    },
  },

  gasReporter: {
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_KEY,
    enabled: reportGas,
  },

  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: reportSize,
    strict: true,
  },

  warnings: {
    "@uniswap/**/*": {
      license: "off",
    },
    "contracts/uniswapV2Router/**/*": {
      license: "off",
    },
  },
};

export default config;
