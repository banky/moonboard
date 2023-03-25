// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MoonPin is ERC721URIStorage {
    // tokenId => vote
    mapping(uint => uint) public votes;
    mapping(address => mapping(uint => bool)) public voted;

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

    function vote(uint tokenId) public {
        require(!voted[msg.sender][tokenId], "MoonPin: already voted");

        votes[tokenId] += 1;
        voted[msg.sender][tokenId] = true;
    }

    function downvote(uint tokenId) public {
        require(voted[msg.sender][tokenId], "MoonPin: has not voted");

        votes[tokenId] -= 1;
        voted[msg.sender][tokenId] = false;
    }

    function getVotes(uint tokenId) public view returns (uint) {
        return votes[tokenId];
    }

    function getVoted(address voter, uint tokenId) public view returns (bool) {
        return voted[voter][tokenId];
    }
}
