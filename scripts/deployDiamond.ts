import { ethers } from "hardhat";
import { Signer } from "ethers";
// const { getSelectors, FacetCutAction } = require("./libraries/diamond.js");

export async function deployDiamond (
  diamondOwner: Signer,
  uniswapV2RouterAddress: string,
  verbose = false,
): Promise<string> {
  // deploy DiamondCutFacet
  const DiamondCutFacet = await ethers.deployContract("DiamondCutFacet", diamondOwner);
  await DiamondCutFacet.waitForDeployment();
  if (verbose) {
    console.log("DiamondCutFacet deployed:", DiamondCutFacet.target);
  }

  // deploy DiamondLoupeFacet
  const DiamondLoupeFacet = await ethers.deployContract("DiamondLoupeFacet", diamondOwner);
  await DiamondLoupeFacet.waitForDeployment();
  if (verbose) {
    console.log("DiamondLoupeFacet deployed:", DiamondLoupeFacet.target);
  }

  // deploy ERC20Swapper Facet
  const ERC20Swapper = await ethers.deployContract("ERC20Swapper", diamondOwner);
  await ERC20Swapper.waitForDeployment();
  if (verbose) {
    console.log("ERC20Swapper deployed:", ERC20Swapper.target);
  }

  // deploy Diamond
  const Diamond = await ethers.deployContract("Diamond", [
    await diamondOwner.getAddress(),
    DiamondCutFacet.target,
    DiamondLoupeFacet.target,
    ERC20Swapper.target,
    uniswapV2RouterAddress,
  ], diamondOwner);

  await Diamond.waitForDeployment();
  if (verbose) {
    console.log("Diamond deployed:", Diamond.target, ", args:",
      await diamondOwner.getAddress(),
      DiamondCutFacet.target,
      DiamondLoupeFacet.target,
      ERC20Swapper.target,
      uniswapV2RouterAddress,
    );
  }

  // Example of Diamond Upgrade
  /*
  // DiamondInit provides a function that is called when the diamond is upgraded
  // https://eips.ethereum.org/EIPS/eip-2535#addingreplacingremoving-functions

  const DiamondInit = await ethers.deployContract("DiamondInit");
  await DiamondInit.waitForDeployment();
  if (verbose) {
    console.log("DiamondInit deployed:", DiamondInit.target);
  }

  // deploy facets used for upgrade
  const cut = [];

  // deploy DAO Facet
  const DAOFacet = await ethers.deployContract("DAOFacet");
  await DAOFacet.waitForDeployment();

  cut.push({
    facetAddress: DAOFacet.target,
    action: FacetCutAction.Add,
    functionSelectors: getSelectors(DAOFacet),
  });

  const DiamondCut = await ethers.getContractAt("IDiamondCut", Diamond.target);

  // call to init function
  const functionCall = DiamondInit.interface.encodeFunctionData("init");
  const tx = await DiamondCut.diamondCut(cut, DiamondInit.target, functionCall);

  const receipt = await tx.wait();
  if (!receipt) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`);
  }

  console.log("Completed Diamond cut");
  */

  return await Diamond.getAddress();
}
