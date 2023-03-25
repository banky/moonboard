// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;
import "./MoonPin.sol";
import "hardhat/console.sol";

contract MoonBoard {
    address public moonpinContract;

    struct Board {
        string name;
        uint[] moonpinIds;
        address owner;
    }

    struct BoardWithMetadata {
        string name;
        uint[] moonpinIds;
        address owner;
        uint votes;
        uint pins;
    }

    mapping(address => Board[]) public moonboards;
    mapping(address => bool) public hasMoonboard;
    address[] public addressesWithMoonboards;
    uint public numMoonboards;

    constructor(address _moonpinContract) {
        moonpinContract = _moonpinContract;
    }

    function createMoonboard(
        string memory name,
        string[] memory tokenURIs
    ) public returns (uint) {
        Board memory board = Board({
            name: name,
            moonpinIds: new uint[](tokenURIs.length),
            owner: msg.sender
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

        moonboards[msg.sender][index] = moonboards[msg.sender][
            moonboards[msg.sender].length - 1
        ];
        moonboards[msg.sender].pop();
    }

    function updateMoonboardName(uint index, string memory name) public {
        moonboards[msg.sender][index].name = name;
    }

    function getMoonboard(
        address owner,
        uint index
    ) public view returns (BoardWithMetadata memory) {
        return applyMetadataToBoard(moonboards[owner][index]);
    }

    function getMoonboards(
        address owner
    ) public view returns (BoardWithMetadata[] memory) {
        Board[] memory boards = moonboards[owner];
        return applyMetadataToBoards(boards);
    }

    function getAllMoonboards()
        public
        view
        returns (BoardWithMetadata[] memory)
    {
        Board[] memory allMoonboards = new Board[](numMoonboards);

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

        return applyMetadataToBoards(allMoonboards);
    }

    function applyMetadataToBoards(
        Board[] memory boards
    ) public view returns (BoardWithMetadata[] memory) {
        BoardWithMetadata[] memory boardsWithMetadata = new BoardWithMetadata[](
            boards.length
        );
        for (uint i = 0; i < boards.length; i++) {
            Board memory board = boards[i];
            uint votes = 0;
            uint pins = 0;
            for (uint j = 0; j < board.moonpinIds.length; j++) {
                uint moonpinId = board.moonpinIds[j];
                votes += MoonPin(moonpinContract).getVotes(moonpinId);
                pins += MoonPin(moonpinContract).getPins(moonpinId);
            }

            boardsWithMetadata[i] = BoardWithMetadata({
                name: board.name,
                moonpinIds: board.moonpinIds,
                owner: board.owner,
                votes: votes,
                pins: pins
            });
        }

        return boardsWithMetadata;
    }

    function applyMetadataToBoard(
        Board memory boards
    ) public view returns (BoardWithMetadata memory) {
        uint votes = 0;
        uint pins = 0;
        for (uint j = 0; j < boards.moonpinIds.length; j++) {
            uint moonpinId = boards.moonpinIds[j];
            votes += MoonPin(moonpinContract).getVotes(moonpinId);
            pins += MoonPin(moonpinContract).getPins(moonpinId);
        }

        BoardWithMetadata memory boardsWithMetadata = BoardWithMetadata({
            name: boards.name,
            moonpinIds: boards.moonpinIds,
            owner: boards.owner,
            votes: votes,
            pins: pins
        });

        return boardsWithMetadata;
    }
}
