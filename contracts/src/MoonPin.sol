// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MoonPin is ERC721 {
    // address => tokenId => vote
    mapping(address => mapping(uint => uint)) public votes;
    mapping(address => mapping(uint => address)) public voted;

    using Counters for Counters.Counter;
    Counters.Counter private tokenIdCounter;

    constructor() ERC721("MoonPin", "MP") {}

    function mint(address to) public returns (uint256 tokenId) {
        tokenId = tokenIdCounter.current();
        _safeMint(to, tokenId);
        tokenIdCounter.increment();
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://ipfs.io/ipfs/";
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        return string(abi.encodePacked(_baseURI(), tokenId));
    }

    function vote(address receiver, uint tokenId) public {
        require(
            voted[receiver][tokenId] == address(0),
            "MoonPin: already voted"
        );

        votes[receiver][tokenId] += 1;
    }
}
