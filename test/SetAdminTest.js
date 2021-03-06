const { ethers } = require("hardhat");
const { expect } = require("chai");


describe("Set Admin Test", function () {
    let owner;
    let tester1;
    let tester2;
    let tester3;
    let NFTFactory;
    let NFT;
    
    beforeEach(async function () {
        [owner, tester1, tester2, tester3] = await ethers.getSigners();
        NFTFactory = await ethers.getContractFactory("TestNFT");
        NFT = await NFTFactory.deploy();
    });


    it("Should set admin correctly", async function () {
        await NFT.mint();
        expect(await NFT.ownerOf(1)).to.equal(owner.address);
        expect(await NFT.adminExists(1)).to.equal(false);

        await NFT.setAdmin(tester1.address, 1);
        expect(await NFT.ownerOf(1)).to.equal(owner.address);
        expect(await NFT.adminOf(1)).to.equal(tester1.address);
    });

    it("Should not allow others to set admin", async function () {
      await NFT.mint();

      await expect(
        NFT.connect(tester2).setAdmin(tester1.address, 1)
      ).to.be.revertedWith("ERC721Lendable: set admin caller is not admin");
  });

    it("Should allow admin to transfer", async function () {
      await NFT.mint();
      await NFT.setAdmin(tester1.address, 1);

      await NFT.connect(tester1).transferFrom(owner.address, tester2.address, 1);
      expect(await NFT.ownerOf(1)).to.equal(tester2.address);
      expect(await NFT.adminOf(1)).to.equal(tester1.address);
    });

    it("Should not allow owner to transfer when admin is set", async function () {
      await NFT.mint();
      await NFT.setAdmin(tester1.address, 1);

      expect(await NFT.ownerOf(1)).to.equal(owner.address);
      await expect(
        NFT.transferFrom(owner.address, tester2.address, 1)
      ).to.be.revertedWith("ERC721Lendable: transfer caller is not admin");
    });
});