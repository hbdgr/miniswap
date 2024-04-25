// SPDX-License-Identifier: MIT
pragma solidity =0.8.24;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title TokenMock
 * Test Standard ERC20 Token
 */
contract TokenMock is ERC20 {
    uint8 private decimalNum;

    constructor(string memory _name, string memory _symbol, uint256 _supply, uint8 _decimalNum) ERC20(_name, _symbol) {
        _mint(msg.sender, _supply);
        decimalNum = _decimalNum;
    }

    function decimals() public view override returns (uint8) {
        return decimalNum;
    }
}
