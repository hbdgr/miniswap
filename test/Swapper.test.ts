import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { parseEther, parseUnits } from "ethers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";

import { deployTestERC20 } from "../scripts/deployTestERC20";
import { deployDiamond } from "../scripts/deployDiamond";

import {
  deployTestUniswapV2Factory,
  deployTestUniswapV2Router,
  createTestETHPair,
  calcMinTokens,
} from "../scripts/deployTestUniswapV2";

describe("ERC20Deposit", function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function deployFixture(): Promise<any> {
    const [owner, acc1] = await ethers.getSigners();

    // deploy and transfer 10000 test erc20 tokens to acc1
    const testERC20Supply = parseUnits("1000000", 18);
    const TestERC20 = await deployTestERC20("TestToken", "TT", testERC20Supply, 18);
    await TestERC20.transfer(acc1.address, parseUnits("10000", 18));

    // deploy test UniswapV2 DEX
    const UniswapV2Factory = await deployTestUniswapV2Factory();
    const UniswapV2Router = await deployTestUniswapV2Router(UniswapV2Factory);

    /* const TestERC20toETHPair = */ await createTestETHPair(
      UniswapV2Factory,
      UniswapV2Router,
      TestERC20,
    );

    // deploy diamond (with ERC20Swapper)
    const diamondAddress = await deployDiamond(
      owner,
      await UniswapV2Router.getAddress(),
    );

    // get ERC20Swapper contract
    const ERC20Swapper = await ethers.getContractAt("ERC20Swapper", diamondAddress);

    return {
      owner,
      acc1,
      TestERC20,
      UniswapV2Factory,
      UniswapV2Router,
      ERC20Swapper,
    };
  }

  describe("ERC20 Swapper ", function () {
    it("test router used by swapper", async function () {
      const { UniswapV2Router, ERC20Swapper } = await loadFixture(deployFixture);

      const routerAddress = await ERC20Swapper.getRouterAddress();
      expect(routerAddress).to.equal(UniswapV2Router.target);
    });

    it("swap tokens and deposit to player acc", async function () {
      const { acc1, TestERC20, UniswapV2Router, ERC20Swapper } = await loadFixture(deployFixture);

      const balanceBefore = await TestERC20.balanceOf(acc1.address);
      const WETH = await ethers.getContractAt("WETH9", await UniswapV2Router.WETH());

      const path = [WETH.target, TestERC20.target]; // exchange path
      const tokensInAmount = parseEther("1"); // 1 eth
      const amountsOut = await UniswapV2Router.getAmountsOut(tokensInAmount, path);
      const tokensOutMinAmount = calcMinTokens(amountsOut[amountsOut.length - 1]); // apply slippage

      // Actual Swap (+ check emitted event)
      await expect(ERC20Swapper.connect(acc1).swapEtherToToken(
        TestERC20.target,
        tokensOutMinAmount,
        { value: tokensInAmount },
      ))
        .to.emit(ERC20Swapper, "TokensSwapped")
        .withArgs(
          acc1.address,
          UniswapV2Router.target,
          tokensInAmount,
          anyValue,
          [WETH.target, TestERC20.target],
        );

      // compare player deposit before and after swap
      const balanceAfter = await TestERC20.balanceOf(acc1.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore + tokensOutMinAmount);
    });
  });
});
