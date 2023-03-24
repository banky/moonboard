// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;
import "./MoonPin.sol";

contract MoonBoard {
    address public moonpinContract;

    struct Board {
        string name;
        uint[] moonpinIds;
        uint votes;
    }

    mapping(address => Board[]) public moonboards;

    constructor(address _moonpinContract) {
        moonpinContract = _moonpinContract;
    }

    function vote(address owner, uint index) public {
        moonboards[owner][index].votes += 1;
    }

    function createMoonboard(
        string memory name,
        string[] memory tokenURIs
    ) public returns (bool success) {
        Board memory board = Board({
            name: name,
            moonpinIds: new uint[](tokenURIs.length),
            votes: 0
        });

        for (uint i = 0; i < tokenURIs.length; i++) {
            uint tokenId = MoonPin(moonpinContract).createMoonPin(
                msg.sender,
                tokenURIs[i]
            );
            board.moonpinIds[i] = tokenId;
        }

        moonboards[msg.sender].push(board);
        return true;
    }

    function updateMoonboardName(uint index, string memory name) public {
        moonboards[msg.sender][index].name = name;
    }
}
