// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

contract Weillenium is ERC20PresetMinterPauser{
    constructor() ERC20PresetMinterPauser("Weillenium", "WNMS"){
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }
}