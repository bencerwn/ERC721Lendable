pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";



interface IERC721Lendable is IERC721 {

    event SetAdmin(address indexed from, address indexed to, uint256 indexed tokenId);

    function adminOf(uint256 tokenId) external returns (address);

    function lendFrom(address from, address to, address admin, uint256 tokenId) external;

    function safeLendFrom(address from, address to, address admin, uint256 tokenId) external;

    function safeLendFrom(address from, address to, address admin, uint256 tokenId, bytes memory _data) external;
    
    function retrieveFrom(address from, address to, uint256 tokenId) external;

    function safeRetrieveFrom(address from, address to, uint256 tokenId) external;

    function safeRetrieveFrom(address from, address to, uint256 tokenId, bytes memory _data) external;
}