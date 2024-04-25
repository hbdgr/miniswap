import { ethers } from "hardhat";
import { deployDiamond } from "./deployDiamond";

// address of already deployed UniswapV2 Router
const uniswapV2RouterAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

async function main() {
  const accounts = await ethers.getSigners();
  const diamondOwner = accounts[0];

  await deployDiamond(diamondOwner, uniswapV2RouterAddress, true);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
