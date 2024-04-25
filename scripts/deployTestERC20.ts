import { ethers } from "hardhat";
import { TokenMock } from "../typechain-types";

export async function deployTestERC20(
  name: string,
  symbol: string,
  supply: bigint | string | number,
  decimals: number = 18,
  verbose = false,
): Promise<TokenMock> {
  const TestERC20 = await ethers.deployContract("TokenMock", [
    name,
    symbol,
    supply,
    decimals,
  ]);

  await TestERC20.waitForDeployment();

  if (verbose) {
    console.log("TestERC20 deployed:", TestERC20.target, ", args:", [
      name,
      symbol,
      supply,
      decimals,
    ]);
  }
  return TestERC20;
}
