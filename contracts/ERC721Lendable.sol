pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./IERC721Lendable.sol";

abstract contract ERC721Lendable is ERC721, IERC721Lendable {

    mapping(uint256 => address) private _admins;


    function adminOf(uint256 tokenId) public view virtual override returns (address) {
        return _admins[tokenId];
    }

    function setAdmin(address to, uint256 tokenId) public virtual override {
        require(_isAdmin(_msgSender(), tokenId), "ERC721Lendable: set admin caller is not admin");
        _setAdmin(to, tokenId);
    }

    // LEND

    function lendFrom(
        address from, 
        address to, 
        address admin,
        uint256 tokenId
    ) public virtual override {
        require(_isAdmin(_msgSender(), tokenId), "ERC721Lendable: lend caller is not admin");
        _lend(from, to, admin, tokenId);
    }

    function safeLendFrom(
        address from, 
        address to, 
        address admin,
        uint256 tokenId
    ) public virtual override {
        safeLendFrom(from, to, admin, tokenId, "");
    }

    function safeLendFrom(
        address from, 
        address to,
        address admin,
        uint256 tokenId,
        bytes memory _data
    ) public virtual override {
        require(_isAdmin(_msgSender(), tokenId), "ERC721Lendable: lend caller is not admin");
        _safeLend(from, to, admin, tokenId, _data);
    }

    // RETRIEVE

    function retrieveFrom(
        address from, 
        address to, 
        uint256 tokenId
    ) public virtual override {
        require(_isAdmin(_msgSender(), tokenId), "ERC721Lendable: retrieve caller is not admin");
        _retrieve(from, to, tokenId);
    }

    function safeRetrieveFrom(
        address from, 
        address to, 
        uint256 tokenId
    ) public virtual override {
        safeRetrieveFrom(from, to, tokenId, "");
    }

    function safeRetrieveFrom(
        address from, 
        address to, 
        uint256 tokenId,
        bytes memory _data
    ) public virtual override {
        require(_isAdmin(_msgSender(), tokenId), "ERC721Lendable: retrieve caller is not admin");
        _safeRetrieve(from, to, tokenId, _data);
    }

    // TRANSFER

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
            spender == admin || isApprovedForAll(admin, spender) ||
            (!_adminExists(tokenId) && _isApprovedOrOwner(spender, tokenId))
        );
    }

    function _safeLend(
        address from, 
        address to, 
        address admin,
        uint256 tokenId,
        bytes memory _data
    ) internal virtual {
        require(!_adminExists(tokenId), "ERC721Lendable: token already lent");
        _setAdmin(admin, tokenId);
        _safeTransfer(from, to, tokenId, _data);
    }

    function _lend(
        address from, 
        address to, 
        address admin,
        uint256 tokenId
    ) internal virtual {
        require(!_adminExists(tokenId), "ERC721Lendable: token already lent");
        _setAdmin(admin, tokenId);
        _transfer(from, to, tokenId);
    }

    function _safeRetrieve(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) internal virtual {
        require(_adminExists(tokenId), "ERC721Lendable: token not lent");
        _setAdmin(address(0), tokenId);
        _safeTransfer(from, to, tokenId, _data);
    }

    function _retrieve(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual {
        require(_adminExists(tokenId), "ERC721Lendable: token not lent");
        _setAdmin(address(0), tokenId);
        _transfer(from, to, tokenId);
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