pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./IERC721Lendable.sol";

contract ERC721Lendable is ERC721, IERC721Lendable {

    mapping(uint256 => address) private _admins;

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {

    }

    function adminOf(uint256 tokenId) public view virtual returns (address) {
        return _admins[tokenId];
    }

    function lend() public virtual override {
        
    } 

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override(ERC721, IERC721) {
        require(_isAdmin(_msgSender(), tokenId), "ERC721: transfer caller is not admin");
        _transfer(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public virtual override(ERC721, IERC721) {
        require(_isAdmin(_msgSender(), tokenId), "ERC721: transfer caller is not admin");
        _safeTransfer(from, to, tokenId, _data);
    }

    function _adminExists(uint256 tokenId) internal view virtual returns (bool) {
        return _admins[tokenId] != address(0);
    }

    function _isAdmin(address spender, uint256 tokenId) internal view virtual returns (bool) {
        require(_exists(tokenId), "ERC721: operator query for nonexistent token");
        address admin = adminOf(tokenId);
        return (spender == admin || (!_adminExists(tokenId) && _isApprovedOrOwner(spender, tokenId)));
    }
}