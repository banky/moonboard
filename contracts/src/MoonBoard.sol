// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;
import "./MoonPin.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract MoonBoard {
    address public moonpinContract;
    uint public createBoardFee = 0.01 ether;
    uint public pinFee = 0.0001 ether;
    address immutable deployoor = msg.sender;
    uint public creatorPinCut = 75;
    uint public denominator = 100;
    address public constant APE = 0x4d224452801ACEd8B2F0aebE155379bb5D594381;
    address public constant UNISWAP_ROUTER =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    IUniswapV2Router02 public uniswapRouter;

    struct Board {
        string name;
        uint[] moonpinIds;
        uint[] externalMoonpinIds;
        address owner;
    }

    struct BoardWithMetadata {
        string name;
        uint[] moonpinIds;
        uint[] externalMoonpinIds;
        address owner;
        uint votes;
        uint pins;
    }

    mapping(address => Board[]) public moonboards;
    mapping(address => bool) public hasMoonboard;
    address[] public addressesWithMoonboards;
    uint public numMoonboards;
    mapping(address => bool) public payoutApecoin;

    constructor(address _moonpinContract) {
        moonpinContract = _moonpinContract;
        uniswapRouter = IUniswapV2Router02(UNISWAP_ROUTER);
    }

    function createMoonboard(
        string memory name,
        string[] memory tokenURIs
    ) public payable returns (uint) {
        uint fee = createBoardFee + (pinFee * tokenURIs.length);
        require(msg.value >= fee, "Not enough ETH sent to create");
        Board memory board = Board({
            name: name,
            moonpinIds: new uint[](tokenURIs.length),
            externalMoonpinIds: new uint[](0),
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
                allMoonboards[index] = boards[j];

                index++;
            }
        }

        return applyMetadataToBoards(allMoonboards);
    }

    function pinToBoard(
        address sourceBoardOwner,
        uint sourceMonnpinId,
        uint targetBoardIndex
    ) public payable {
        require(msg.value >= pinFee, "Not enough ETH sent to pin");
        address creator = MoonPin(moonpinContract).ownerOf(sourceMonnpinId);
        uint creatorCut = (pinFee * creatorPinCut) / denominator;

        if (payoutApecoin[creator]) {
            swapEthForApecoin(creatorCut, creator);
        } else {
            payable(creator).transfer(creatorCut);
        }

        if (payoutApecoin[sourceBoardOwner]) {
            swapEthForApecoin(msg.value - creatorCut, sourceBoardOwner);
        } else {
            payable(sourceBoardOwner).transfer(msg.value - creatorCut);
        }

        address pinner = msg.sender;
        Board storage targetBoard = moonboards[pinner][targetBoardIndex];
        targetBoard.externalMoonpinIds.push(sourceMonnpinId);

        MoonPin(moonpinContract).pin(sourceMonnpinId);
    }

    function unpinFromBoard(
        uint sourceMonnpinId,
        uint targetBoardIndex
    ) public {
        address pinner = msg.sender;
        Board storage targetBoard = moonboards[pinner][targetBoardIndex];
        uint[] storage externalMoonpinIds = targetBoard.externalMoonpinIds;

        for (uint i = 0; i < externalMoonpinIds.length; i++) {
            if (externalMoonpinIds[i] == sourceMonnpinId) {
                externalMoonpinIds[i] = externalMoonpinIds[
                    externalMoonpinIds.length - 1
                ];
                externalMoonpinIds.pop();
                break;
            }
        }

        MoonPin(moonpinContract).unpin(sourceMonnpinId);
    }

    function withdraw(address payable recipient, uint amount) public {
        require(msg.sender == deployoor, "Only deployoor can withdraw");
        recipient.transfer(amount);
    }

    function applyMetadataToBoards(
        Board[] memory boards
    ) internal view returns (BoardWithMetadata[] memory) {
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
                externalMoonpinIds: board.externalMoonpinIds,
                owner: board.owner,
                votes: votes,
                pins: pins
            });
        }

        return boardsWithMetadata;
    }

    function applyMetadataToBoard(
        Board memory board
    ) internal view returns (BoardWithMetadata memory) {
        uint votes = 0;
        uint pins = 0;
        for (uint j = 0; j < board.moonpinIds.length; j++) {
            uint moonpinId = board.moonpinIds[j];
            votes += MoonPin(moonpinContract).getVotes(moonpinId);
            pins += MoonPin(moonpinContract).getPins(moonpinId);
        }

        BoardWithMetadata memory boardsWithMetadata = BoardWithMetadata({
            name: board.name,
            moonpinIds: board.moonpinIds,
            externalMoonpinIds: board.externalMoonpinIds,
            owner: board.owner,
            votes: votes,
            pins: pins
        });

        return boardsWithMetadata;
    }

    function swapEthForApecoin(uint amount, address receiver) internal {
        require(amount > 0, "Amount must be greater than 0");

        uint deadline = block.timestamp + 5;
        uniswapRouter.swapExactETHForTokens{value: amount}(
            amount,
            swapPath(),
            receiver,
            deadline
        );
    }

    function swapPath() private view returns (address[] memory) {
        address[] memory path = new address[](2);
        path[0] = uniswapRouter.WETH();
        path[1] = APE;

        return path;
    }
}
