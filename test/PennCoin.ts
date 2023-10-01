import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  import { expect } from "chai";
  import { ethers } from "hardhat";
  const initialSupply = 1_000_000;
  
  describe("PennCoin", function () {
    async function deployPennCoinFixture() {
      const initialSupply = 1_000_000;
  
      const [owner, otherAccount] = await ethers.getSigners();
  
      const pennCoinFactory = await ethers.getContractFactory("PennCoin");
      const pennCoin = await pennCoinFactory.deploy(initialSupply);
  
      return { pennCoin, initialSupply, owner, otherAccount };
    }
  
      describe("Deployment", function () {
              it("Should set the right initial supply", async function () {
                  const { pennCoin, initialSupply } = await loadFixture(deployPennCoinFixture);
  
                  expect(await pennCoin.totalSupply()).to.equal(initialSupply);
              });
  
              it("Should set the right owner", async function () {
                  const { pennCoin, owner, initialSupply } = await loadFixture(deployPennCoinFixture);
  
                  expect(await pennCoin.balanceOf(owner.address)).to.equal(initialSupply);
              });

      describe("Transfer", function () {
        it("Should transfer tokens from one account to another", async function () {
        const { pennCoin, owner, otherAccount } = await loadFixture(deployPennCoinFixture);
  
        // Transfer 100 tokens from the owner to the other account.
        await pennCoin.transfer(otherAccount.address, 100);
  
        // Assert that the balances of the two accounts have changed as expected.
        expect(await pennCoin.balanceOf(owner.address)).to.equal(initialSupply - 100);
        expect(await pennCoin.balanceOf(otherAccount.address)).to.equal(100);
      });
  
      it("Should revert if the sender does not have enough tokens", async function () {
        const { pennCoin, owner, otherAccount } = await loadFixture(deployPennCoinFixture);
  
        // Try to transfer 1_000_001 tokens from the owner to the other account.
        await expect(pennCoin.transfer(otherAccount.address, initialSupply + 1)).to.be.revertedWith("ERC20: transfer amount exceeds balance");
      });
    });
  
    describe("Approve", function () {
      it("Should allow one account to spend tokens on behalf of another account", async function () {
        const { pennCoin, owner, otherAccount } = await loadFixture(deployPennCoinFixture);
  
        // Approve the other account to spend 100 tokens on behalf of the owner.
        await pennCoin.approve(otherAccount.address, 100);
  
        // Assert that the allowance of the other account has changed as expected.
        expect(await pennCoin.allowance(owner.address, otherAccount.address)).to.equal(100);
      });
    });

    describe("TransferFrom", function () {
      it("Should transfer tokens from one account to another using the allowance of the spender", async function () {
        const { pennCoin, owner, otherAccount } = await loadFixture(deployPennCoinFixture);
  
        // Approve the other account to spend 100 tokens on behalf of the owner.
        await pennCoin.approve(otherAccount.address, 100);
  
        // Transfer 100 tokens from the owner to the other account using the `transferFrom()` function.
        await pennCoin.transferFrom(owner.address, otherAccount.address, 100);
  
        // Assert that the balances of the two accounts have changed as expected.
        expect(await pennCoin.balanceOf(owner.address)).to.equal(initialSupply - 100);
        expect(await pennCoin.balanceOf(otherAccount.address)).to.equal(100);
      });
  
      it("Should revert if the spender does not have enough allowance", async function () {
        const { pennCoin, owner, otherAccount } = await loadFixture(deployPennCoinFixture);
  
        // Approve the other account to spend 100 tokens on behalf of the owner
        await pennCoin.approve(otherAccount.address, 100);

      // Try to transfer 101 tokens from the owner to the other account using the `transferFrom()` function.
      await expect(pennCoin.transferFrom(owner.address, otherAccount.address, 101)).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
    });
  });
});
});