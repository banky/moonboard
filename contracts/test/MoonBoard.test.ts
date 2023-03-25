import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { token } from "../typechain-types/@openzeppelin/contracts";

describe("MoonBoard", function () {
  async function deployMoonboardFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const MoonPinFactory = await ethers.getContractFactory("MoonPin");
    const moonPin = await MoonPinFactory.deploy();

    const MoonBoardFactory = await ethers.getContractFactory("MoonBoard");
    const moonBoard = await MoonBoardFactory.deploy(moonPin.address);
    await moonBoard.deployed();

    return { moonBoard, moonPin, owner, otherAccount };
  }

  it("Should create a moonBoard", async () => {
    const { moonBoard, moonPin, owner } = await loadFixture(
      deployMoonboardFixture
    );

    await moonBoard.createMoonboard("test moonboard", [
      "ipfs://test-url",
      "ipfs://test-url2",
    ]);

    const board = await moonBoard.getMoonboard(owner.address, 0);
    expect(board.name).to.equal("test moonboard");
    expect(board.moonpinIds[0]).to.equal(0);
    expect(board.moonpinIds[1]).to.equal(1);
    expect(board.votes).to.equal(0);
    const tokenUri = await moonPin.tokenURI(0);
    expect(tokenUri).to.equal("ipfs://test-url");
  });

  it("gets all moonboards", async () => {
    const { moonBoard, moonPin, owner, otherAccount } = await loadFixture(
      deployMoonboardFixture
    );

    await moonBoard.createMoonboard("test moonboard", [
      "ipfs://test-url",
      "ipfs://test-url2",
    ]);

    await moonBoard.createMoonboard("test moonboard2", [
      "ipfs://test-url",
      "ipfs://test-url2",
    ]);

    await moonBoard
      .connect(otherAccount)
      .createMoonboard("test moonboard3", [
        "ipfs://test-url",
        "ipfs://test-url2",
      ]);

    const boards = await moonBoard.getAllMoonboards();
    expect(boards.length).to.equal(3);
  });
});
