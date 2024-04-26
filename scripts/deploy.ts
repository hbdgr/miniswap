import { ethers } from "hardhat";
import { deployDiamond } from "./deployDiamond";

// UniswapV2 addresses:
// https://docs.uniswap.org/contracts/v2/reference/smart-contracts/v2-deployments

// address of already deployed UniswapV2 Router
const uniswapV2RouterAddress = "";

async function main() {
  const accounts = await ethers.getSigners();
  const diamondOwner = accounts[0];

  await deployDiamond(diamondOwner, uniswapV2RouterAddress, true);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
