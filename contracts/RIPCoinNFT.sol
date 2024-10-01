// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RIPCoinNFT is ERC721, Ownable(msg.sender) {
    uint256 private _tokenIds;
    string private _baseTokenURI;
    mapping(address => bool) public hasMinted;

    constructor(string memory baseURI) ERC721("RIPCoinNFT", "RIPNFT") {
        _baseTokenURI = baseURI; // Set base URI for NFTs
    }

    // Mint function to create new NFTs
    function mint(address recipient) external onlyOwner returns (uint256) {
        require(!hasMinted[recipient], "Address has already minted an NFT");
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        _safeMint(recipient, newTokenId); // Mint the NFT to the recipient
        return newTokenId;
    }

    // Override base URI to return the base token URI set by constructor
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }
}