pragma solidity =0.5.16;

import '@uniswap/v2-core/contracts/UniswapV2Pair.sol';
import './interfaces/IPairCode.sol';

contract PairCode is IPairCode{
    function pairCodeHash() external pure returns (bytes32) {
        return keccak256(type(UniswapV2Pair).creationCode);
    }
}
