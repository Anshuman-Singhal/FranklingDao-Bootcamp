import { ethers } from "hardhat";

async function main() {
  const initialSupply = 1_000_000;

  const pennCoinFactory = await ethers.getContractFactory("PennCoin");
  const pennCoin = await pennCoinFactory.deploy(initialSupply);

  console.log("PennCoin deployed to:", pennCoin.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });