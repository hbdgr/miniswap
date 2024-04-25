// SPDX-License-Identifier: MIT
pragma solidity =0.8.24;

/// @title IERC20Swapper
/// @dev Interface for ERC20Swapper contract
interface IERC20Swapper {
    event TokensSwapped(
        address indexed sender,
        address indexed router,
        uint256 amountEthIn,
        uint256 amountOut,
        address[] path
    );

    /// @dev swaps the `msg.value` Ether to at least `minAmount` of tokens in `address`, or reverts
    /// @param token The address of ERC-20 token to swap
    /// @param minAmount The minimum amount of tokens transferred to msg.sender
    /// @return The actual amount of transferred tokens
    function swapEtherToToken(address token, uint256 minAmount) external payable returns (uint256);
}
