// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";


interface IERC721Lendable is IERC721 {

    event SetAdmin(address indexed from, address indexed to, uint256 indexed tokenId);

    // ADMIN

    function adminOf(uint256 tokenId) external returns (address);

    function adminExists(uint256 tokenId) external returns (bool);

    function setAdmin(address to, uint256 tokenId) external;
}