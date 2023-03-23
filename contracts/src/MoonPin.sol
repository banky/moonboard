// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MoonPin is ERC721URIStorage {
    // address => tokenId => vote
    mapping(address => mapping(uint => uint)) public votes;
    mapping(address => mapping(uint => address)) public voted;

    using Counters for Counters.Counter;
    Counters.Counter private tokenIdCounter;

    constructor() ERC721("MoonPin", "MP") {}

    function createMoonPin(
        address creator,
        string memory tokenURI
    ) public returns (uint256 tokenId) {
        tokenId = tokenIdCounter.current();
        _safeMint(creator, tokenId);
        _setTokenURI(tokenId, tokenURI);
        tokenIdCounter.increment();
    }

    function vote(address receiver, uint tokenId) public {
        require(
            voted[receiver][tokenId] == address(0),
            "MoonPin: already voted"
        );

        votes[receiver][tokenId] += 1;
    }
}
