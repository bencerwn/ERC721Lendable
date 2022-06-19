// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721Lendable.sol";


contract TestNFT is ERC721Lendable {

    uint256 private count = 0;

    constructor() ERC721("Test", "TEST") {}

    function mint() public {
        count += 1;
        _safeMint(_msgSender(), count);
    }
}