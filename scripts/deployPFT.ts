import { ethers } from "hardhat";

async function main() {
  // Get the contract factory
  const pennFTFactory = await ethers.getContractFactory("PennFT");

  // Deploy the contract
  const pennFT = await pennFTFactory.deploy();

  // Print the contract address
  console.log("PennFT deployed to:", pennFT.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});