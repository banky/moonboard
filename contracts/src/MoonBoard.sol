// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

contract MoonBoard {
    address public creator;
    string public name;
    uint public votes;

    struct Moonpin {
        address token;
        uint id;
    }

    Moonpin[] public moonpins;

    constructor(string memory _name) {
        creator = msg.sender;
        name = _name;
    }

    function addMoonpin(address _token, uint _id) public {
        moonpins.push(Moonpin(_token, _id));
    }

    function vote() public {
        votes++;
    }

    function getMoonpins() public view returns (Moonpin[] memory) {
        return moonpins;
    }
}
