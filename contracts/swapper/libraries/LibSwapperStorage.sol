// SPDX-License-Identifier: MIT
pragma solidity =0.8.24;

/**
 * @title Diamond Storage for for ERC20 Swapper
 */
library LibSwapperStorage {
    bytes32 internal constant SWAPPER_STORAGE_SLOT = keccak256("SWAPPER.STORAGE");

    struct SwapperStorage {
        address router; // uniswap v2 router address which is used for swaps
    }

    event UniswapV2RouterSet(address indexed router);

    function setUniswapV2Router(address _router) internal {
        SwapperStorage storage s = getStorage();
        s.router = _router;
        emit UniswapV2RouterSet(_router);
    }

    function router() internal view returns (address router_) {
        router_ = getStorage().router;
    }

    /**
     * @notice Swapper storage
     * @return s A pointer to an "arbitrary" location in memory
     */
    function getStorage() internal pure returns (SwapperStorage storage s) {
        bytes32 position = SWAPPER_STORAGE_SLOT;
        assembly {
            s.slot := position
        }
    }
}
