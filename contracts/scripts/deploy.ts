import { ethers } from "hardhat";

async function main() {
  const MoonPin = await ethers.getContractFactory("MoonPin");
  const moonPin = await MoonPin.deploy();
  await moonPin.deployed();

  const MoonBoard = await ethers.getContractFactory("MoonBoard");
  const moonBoard = await MoonBoard.deploy(moonPin.address);

  console.log(`MoonPin deployed at address: ${moonPin.address}`);
  console.log(`MoonBoard deployed at address: ${moonBoard.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
