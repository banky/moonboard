// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MoonPin is ERC721 {
    // address public creator;
    // uint public votes;

    constructor(
        string memory name_,
        string memory symbol_
    ) ERC721("MoonPin", "MP") {}
}
