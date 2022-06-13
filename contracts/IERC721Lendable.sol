pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";



interface IERC721Lendable is IERC721 {

    function lend(address to, uint256 tokenId) external;
    
    function retrieve() external;
}