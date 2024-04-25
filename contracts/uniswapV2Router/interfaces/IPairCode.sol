pragma solidity >=0.5.0;

interface IPairCode {
    function pairCodeHash() external pure returns (bytes32);
}
