import { ethers } from "hardhat";
import { ZeroAddress, parseEther, parseUnits } from "ethers";
import {
  UniswapV2Router02,
  UniswapV2Pair,
  IERC20Metadata,
  UniswapV2Factory,
  PairCode,
} from "../typechain-types";

const testSlippage = parseEther("0.05"); // 5% on 18 dec

export async function getTime(): Promise<number> {
  const latestBlock = await ethers.provider.getBlock("latest");
  if (!latestBlock) {
    throw new Error("Failed to getTime");
  }
  return latestBlock.timestamp;
}

export async function testDeadline(): Promise<number> {
  const deadlineTimeout = 60 * 60; // 1 hour
  return await getTime() + deadlineTimeout;
}

// returns PairCode
async function deployPairCode(verbose = false): Promise<PairCode> {
  const PairCode = await ethers.deployContract("PairCode");

  if (verbose) {
    console.log("PairCode deployed:", PairCode.target);
  }
  return PairCode;
}

// returns Uniswap V2 Factory
export async function deployTestUniswapV2Factory (verbose = false): Promise<UniswapV2Factory> {
  // use ZeroAddress for _feeToSetter
  const UniswapV2Factory = await ethers.deployContract("UniswapV2Factory", [ZeroAddress]);

  if (verbose) {
    console.log("UniswapV2Factory deployed:", UniswapV2Factory.target);
  }
  return UniswapV2Factory;
}

// returns Uniswap V2 Router
export async function deployTestUniswapV2Router (
  factory: UniswapV2Factory,
  verbose = false,
): Promise<UniswapV2Router02> {
  const WETH = await ethers.deployContract("WETH9");

  if (verbose) {
    console.log("WETH deployed:", WETH.target);
  }
  const pairCode = await deployPairCode();

  const UniswapV2Router02 = await ethers.deployContract("UniswapV2Router02", [
    factory.target,
    WETH.target,
    pairCode.target,
  ]);

  if (verbose) {
    console.log("UniswapV2Router02 deployed:", UniswapV2Router02.target);
  }
  return UniswapV2Router02;
}

// returns Uniswap V2 Router
export async function deployTestUniswapV2 (): Promise<UniswapV2Router02> {
  const factory = await deployTestUniswapV2Factory();
  return deployTestUniswapV2Router(factory);
}

export function calcMinTokens(amount: bigint): bigint {
  return amount - (amount * testSlippage) / parseEther("1");
}

export async function createTestETHPair(
  factory: UniswapV2Factory,
  router: UniswapV2Router02,
  token: IERC20Metadata,
): Promise<UniswapV2Pair> {
  const [acc1] = await ethers.getSigners();

  const tokenDecimals = await token.decimals();
  const tokenAmount = parseUnits("100", tokenDecimals);

  // make price of eth 10:1 to the token
  const ethAmount = parseEther("10"); // eth decimals - 18

  // apply slippage
  const tokenAmountMin = calcMinTokens(tokenAmount);
  const ethAmountMin = calcMinTokens(ethAmount);

  await token.approve(router.target, tokenAmount);
  const tx = await router.addLiquidityETH(
    token.target,
    tokenAmount,
    tokenAmountMin,
    ethAmountMin,
    acc1.address,
    await testDeadline(),
    { value: ethAmount },
  );
  await tx.wait();

  const WETHAddress = await router.WETH();
  const pairAddress = await factory.getPair(token.target, WETHAddress);
  return ethers.getContractAt("UniswapV2Pair", pairAddress);
}
