import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  import { expect } from "chai";
  import { ethers } from "hardhat";

  describe("PennFT", function () {
    let pennFTContract;
    let owner;
    let recipient1;
    let recipient2;
  
    beforeEach(async function () {
      // Deploy the PennFT contract
      const pennFTFactory = await ethers.getContractFactory("PennFT");
      pennFTContract = await pennFTFactory.deploy();
  
      // Get the owner and recipient accounts
      [owner, recipient1, recipient2] = await ethers.getSigners();
  
        // Mint an NFT to the owner
      const tokenURI = "https://example.com/nft.json";
      await pennFTContract.MintNFT(owner.address, tokenURI);
    });
  
    it("Should allow the owner to transfer NFTs", async function () {
      // Transfer the NFT to the recipient
      await pennFTContract.transferFrom(owner.address, recipient1.address, 0);
  
      // Assert that the NFT was transferred successfully
      expect(await pennFTContract.balanceOf(recipient1.address)).to.equal(1);
      expect(await pennFTContract.ownerOf(0)).to.equal(recipient1.address);
    });
  
    it("Should prevent non-owners from transferring NFTs", async function () {
      // Attempt to transfer the NFT as the recipient account
      await expect(pennFTContract.connect(recipient1).transferFrom(owner.address, recipient2.address, 0)).to.be.revertedWith("ERC721: caller is not token owner or approved");
    });
  
    it("Should allow the owner to approve others to transfer their NFTs", async function () {
      // Approve the recipient to transfer the NFT on their behalf
      await pennFTContract.approve(recipient1.address, 0);
        
      // Assert that the recipient was approved successfully
      expect(await pennFTContract.isApprovedForAll(owner.address, recipient1.address)).to.be.true;
    });
  
    it("Should allow approved users to transfer NFTs on behalf of the owner", async function () {
      // Approve the recipient to transfer the NFT on their behalf
      await pennFTContract.approve(recipient1.address, 0);
  
      // Transfer the NFT to the recipient as the recipient account
      await pennFTContract.connect(recipient1).transferFrom(owner.address, recipient2.address, 0);
  
      // Assert that the NFT was transferred successfully
      expect(await pennFTContract.balanceOf(recipient2.address)).to.equal(1);
      expect(await pennFTContract.ownerOf(0)).to.equal(recipient2.address);
    });
  
    it("Should allow the owner to mint NFTs", async function () {
      const tokenURI2 = "https://example.com/nft2.json";
  
      // Mint an NFT to the owner
      await pennFTContract.MintNFT(owner.address, tokenURI2);
  
      // Assert that the NFT was minted successfully
      expect(await pennFTContract.balanceOf(owner.address)).to.equal(2);
      expect(await pennFTContract.ownerOf(1)).to.equal(owner.address);
    });
  });
  