import { ethers } from "hardhat";
import { deployDiamond } from "./deployDiamond";
import { deployTestUniswapV2Factory, deployTestUniswapV2Router } from "./deployTestUniswapV2";

// To reduce deployed costs, address of already deployed UniswapV2 Router or Factory could be used
//
// UniswapV2 addresses:
// https://docs.uniswap.org/contracts/v2/reference/smart-contracts/v2-deployments

async function main() {
  const [diamondOwner] = await ethers.getSigners();

  // deploy UniswapV2 DEX
  const UniswapV2Factory = await deployTestUniswapV2Factory(true);
  const UniswapV2Router = await deployTestUniswapV2Router(UniswapV2Factory, true);

  // deploy Diamond Proxy containing ERC20Swapper
  await deployDiamond(diamondOwner, await UniswapV2Router.getAddress(), true);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
