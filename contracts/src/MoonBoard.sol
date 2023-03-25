// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;
import "./MoonPin.sol";
import "hardhat/console.sol";

contract MoonBoard {
    address public moonpinContract;

    struct Board {
        string name;
        uint[] moonpinIds;
        uint votes;
    }

    mapping(address => Board[]) public moonboards;
    mapping(address => bool) public hasMoonboard;
    address[] public addressesWithMoonboards;
    uint public numMoonboards;

    constructor(address _moonpinContract) {
        moonpinContract = _moonpinContract;
    }

    function vote(address owner, uint index) public {
        moonboards[owner][index].votes += 1;
    }

    function createMoonboard(
        string memory name,
        string[] memory tokenURIs
    ) public returns (uint) {
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

        if (!hasMoonboard[msg.sender]) {
            hasMoonboard[msg.sender] = true;
            addressesWithMoonboards.push(msg.sender);
        }

        numMoonboards++;

        return moonboards[msg.sender].length - 1;
    }

    function deleteMoonboard(uint index) public {
        numMoonboards--;

        delete moonboards[msg.sender][index];
    }

    function updateMoonboardName(uint index, string memory name) public {
        moonboards[msg.sender][index].name = name;
    }

    function getMoonboard(
        address owner,
        uint index
    ) public view returns (Board memory) {
        return moonboards[owner][index];
    }

    function getMoonboards(address owner) public view returns (Board[] memory) {
        return moonboards[owner];
    }

    function getAllMoonboards() public view returns (Board[] memory) {
        Board[] memory allMoonboards = new Board[](numMoonboards);
        console.log("numMoonboards", numMoonboards);
        console.log(
            "addressesWithMoonboards.length",
            addressesWithMoonboards.length
        );
        uint index = 0;
        for (uint i = 0; i < addressesWithMoonboards.length; i++) {
            address owner = addressesWithMoonboards[i];
            Board[] memory boards = moonboards[owner];
            for (uint j = 0; j < boards.length; j++) {
                console.log("index", index);
                allMoonboards[index] = boards[j];

                index++;
            }
        }

        return allMoonboards;
    }
}
