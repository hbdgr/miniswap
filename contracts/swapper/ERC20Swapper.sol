// SPDX-License-Identifier: MIT
pragma solidity =0.8.24;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import { IUniswapV2Router02 } from "../uniswapV2Router/interfaces/IUniswapV2Router02.sol";

import { IERC20Swapper } from "./interfaces/IERC20Swapper.sol";
import { LibSwapperStorage } from "./libraries/LibSwapperStorage.sol";

/**
 * @title ERC20Swapper
 * A very minimal contract enabling integration with an external decentralized exchange
 * to perform token swaps.
 */
contract ERC20Swapper is IERC20Swapper {
    using SafeERC20 for IERC20;

    /**
     * @inheritdoc IERC20Swapper
     *
     * @dev This function will swap native ETH for the specified amount of given ERC20 token.
     *      * minAmount already includes the slippage!
     */
    function swapEtherToToken(address token, uint256 minAmount) public payable returns (uint256) {
        IUniswapV2Router02 router = IUniswapV2Router02(LibSwapperStorage.router());

        // arbitrary value; if tx is not mined within this deadline, the swap will fail.
        uint256 deadlineTimeout = block.timestamp + 1 hours;

        // straight path from WETH to token - could not be optimal for low liquid tokens
        address[] memory path = new address[](2);
        path[0] = router.WETH();
        path[1] = token;

        uint256[] memory amounts = router.swapExactETHForTokens{value: msg.value}(
            minAmount,
            path,
            msg.sender, // receiver
            deadlineTimeout
        );

        uint256 amountOut = amounts[amounts.length - 1];
        emit TokensSwapped(msg.sender, address(router), msg.value, amountOut, path);
        return amountOut;
    }

    /**
     * @inheritdoc IERC20Swapper
     */
    function getRouterAddress() external view returns (address) {
        return address(LibSwapperStorage.getStorage().router);
    }
}
