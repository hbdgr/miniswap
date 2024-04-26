# ERC20 Token Swap with Diamond Proxy

## Overview

This project implements an ERC20 token swap integrated with the Diamond Proxy, which is a very interesting alternative over other proxy patterns like UUPS and Transparent Proxy. The implementation has an owner limited to the Diamond Proxy sole ownership. Eventually, ownership should transition to a multisig wallet or DAO to further enhance security.

A significant part of the project lies in its configuration, which includes TypeScript, ESLint, Husky, Solhint, and Solidity coverage. These tools ensure a better development experience and maintain high code quality. The project relies on minimal modifications to dependencies such as the Diamond standard, OpenZeppelin, and Uniswap contracts, aiming to stay as close to the original implementations as possible. The main change across these dependencies is the unification of the Solidity version used, while still accommodating multiple versions to avoid breaking changes.

An additional feature `contracts/uniswapV2Router/PairCode.sol`, simplifies the development and adaptation of the Uniswap V2 code. This approach slightly increases gas usage due to the automatic computation of the creation code hash but reduces the dependency on hardcoded values. This change, though a bit of a hack, makes the project easier to develop.

While newer solutions like Uniswap V3 and V4, or other AMM protocols exist, Uniswap V2 remains popular and widely used, making it a good starting point for expanding this project.

## Key Components

- **Diamond Proxy**: Used to manage upgrades and interactions.
- **UniswapV2Router**: A slightly modified version of the original UniswapV2Router02 contract.
- **ERC20Swapper**: Allows both EOA and external contracts to swap tokens. The main function `swapEtherToToken` uses `msg.sender` as the hardcoded receiver.

### Implementation Notes

Gas usage can be tracked through the integration of "hardhat-contract-sizer" and "hardhat-gas-reporter". However, the implementation is not optimized for minimal gas usage but focuses on readability, simplicity, and the security of proven solutions. If gas reduction is crucial, the Router might be omitted, and direct interaction with specific Uniswap Pair contracts or implementing a minimal version of a DEX could be considered.

## Scripts and Commands

To work with this project, you can use the following npm scripts:

### Lint

```bash
npm run lint          # Lint JavaScript and TypeScript files
```

### Solhint

```bash
npm run check         # Check Solidity contracts for style and security issues
```

### Test

```bash
npm run test          # Run tests using Hardhat
```

### Coverage

```bash
npm run coverage      # Generate test coverage report
```

## Deployment Addresses

The following contracts have been deployed on the Sepolia test network using `scripts/deploy.ts`:

- **UniswapV2Factory**: `0x2011987b0aC8AbbA33fC5E38B8D2640E96174cF7`
- **WETH**: `0x2fA034c9aCE17b44178465A10251d92A369C00E0`
- **UniswapV2Router02**: `0xF1562b021DBEfFCd4f9ec8C8cAC7B5a5Af4a1bba`
- **DiamondCutFacet**: `0xa2a49A00eE4FDc72b84D4aD8C278ef0279F66677`
- **DiamondLoupeFacet**: `0x3e599986F0f994227Bb0c687D97DC52C2F17E7D8`
- **ERC20Swapper**: `0x3990fAe3d1FC31AD7D79229cA35580e926b1Ab30`
- **Diamond**: `0xeB4AbbcC977C6Da2c6a34c199E0bA54245829F42` with args `0x22287f88249Fc96f72a49CBC2641EdC5be05EF76 0xa2a49A00eE4FDc72b84D4aD8C278ef0279F66677 0x3e599986F0f994227Bb0c687D97DC52C2F17E7D8 0x3990fAe3d1FC31AD7D79229cA35580e926b1Ab30 0xF1562b021DBEfFCd4f9ec8C8cAC7B5a5Af4a1bba`

### Example Transaction

A successful swap transaction can be viewed [here](https://sepolia.etherscan.io/tx/0x383a2c0f5761fe0ea4bd44c8b2dcccfcb950b70a57534066a0381c54865e04d3), executed using `scripts/useSwapper.ts`.

