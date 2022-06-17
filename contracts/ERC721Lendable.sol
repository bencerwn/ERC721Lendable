pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./IERC721Lendable.sol";

abstract contract ERC721Lendable is ERC721, IERC721Lendable {

    mapping(uint256 => address) private _admins;


    // ADMIN

    function adminOf(uint256 tokenId) public view virtual override returns (address) {
        return _admins[tokenId];
    }

    function setAdmin(address to, uint256 tokenId) public virtual override {
        require(_isAdmin(_msgSender(), tokenId), "ERC721Lendable: set admin caller is not admin");
        _setAdmin(to, tokenId);
    }

    // OVERRIDE

    function approve(address to, uint256 tokenId) public virtual override(ERC721, IERC721) {
        address owner = ERC721.ownerOf(tokenId);
        require(to != owner, "ERC721Lendable: approval to current owner");
        require(_isAdmin(_msgSender(), tokenId), "ERC721Lendable: approve caller is not admin");
        _approve(to, tokenId);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override(ERC721, IERC721) {
        require(_isAdmin(_msgSender(), tokenId), "ERC721Lendable: transfer caller is not admin");
        _transfer(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public virtual override(ERC721, IERC721) {
        require(_isAdmin(_msgSender(), tokenId), "ERC721Lendable: transfer caller is not admin");
        _safeTransfer(from, to, tokenId, _data);
    }

    // INTERNAL

    function _isAdmin(address spender, uint256 tokenId) internal view virtual returns (bool) {
        require(_exists(tokenId), "ERC721Lendable: operator query for nonexistent token");
        address admin = ERC721Lendable.adminOf(tokenId);
        return (
            spender == admin || isApprovedForAll(admin, spender) || getApproved(tokenId) == spender ||
            (!_adminExists(tokenId) && _isApprovedOrOwner(spender, tokenId))
        );
    }

    function _adminExists(uint256 tokenId) internal view virtual returns (bool) {
        return _admins[tokenId] != address(0);
    }

    function _setAdmin(address to, uint256 tokenId) internal virtual {
        address from = adminOf(tokenId);
        _admins[tokenId] = to;
        emit SetAdmin(from, to, tokenId);
    }
}