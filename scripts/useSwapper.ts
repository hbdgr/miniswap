import { ethers } from "hardhat";
import { parseEther, parseUnits } from "ethers";

import { deployTestERC20 } from "./deployTestERC20";
import { createTestETHPair } from "./deployTestUniswapV2";

// Address of already deployed Diamond with ERC20Swapper (ethereum sepolia testnet)
const diamondAddress = "0xeB4AbbcC977C6Da2c6a34c199E0bA54245829F42";

async function main() {
  const [acc1] = await ethers.getSigners();

  // get ERC20Swapper contract
  const ERC20Swapper = await ethers.getContractAt("ERC20Swapper", diamondAddress);

  // get router address used by ERC20Swapper
  const routerAddress = await ERC20Swapper.getRouterAddress();
  const UniswapV2Router = await ethers.getContractAt("UniswapV2Router02", routerAddress);

  // deploy example erc20 token to acc1
  const supply = parseUnits("1000000", 18);
  const SwapToken = await deployTestERC20("SwapToken", "ST", supply, 18);
  console.log("SwapToken deployed:", SwapToken.target);

  // create test ETH/SwapToken pair (add liquidity)
  const TestERC20toETHPair = await createTestETHPair(
    UniswapV2Router,
    SwapToken,
  );
  console.log("Liquidity: ETH/SwapToken pair created:", TestERC20toETHPair.target);

  const tx = await ERC20Swapper.connect(acc1).swapEtherToToken(
    SwapToken.target,
    0, // minimal amountOutMin.. (100% slippage - only for test purposes)
    { value: parseEther("0.01") },
  );
  const receipt = await tx.wait(2); // wait 2 confirmations

  console.log("Swap completed tx receipt", receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
