const { ethers } = require("hardhat");
const { expect } = require("chai");


describe("Approve Admin Test", function () {
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


    it("Should allow operator to set admin", async function () {
        await NFT.mint();

        await expect(
          NFT.connect(tester1).setAdmin(tester2.address, 1)
        ).to.be.revertedWith("ERC721Lendable: set admin caller is not admin");
        await NFT.setApprovalForAll(tester1.address, true);

        await NFT.connect(tester1).setAdmin(tester2.address, 1);  
        expect(await NFT.adminOf(1)).to.equal(tester2.address);
    });

    it("Should allow token approved to set admin", async function () {
      await NFT.mint();

      await expect(
        NFT.connect(tester1).setAdmin(tester2.address, 1)
      ).to.be.revertedWith("ERC721Lendable: set admin caller is not admin");
      await NFT.approve(tester1.address, 1);

      await NFT.connect(tester1).setAdmin(tester2.address, 1);  
      expect(await NFT.adminOf(1)).to.equal(tester2.address);
    });

    it("Should allow admin operator to set admin", async function () {
      await NFT.mint();
      await NFT.setAdmin(tester1.address, 1);

      await expect(
        NFT.connect(tester2).setAdmin(tester3.address, 1)
      ).to.be.revertedWith("ERC721Lendable: set admin caller is not admin");
      await NFT.connect(tester1).setApprovalForAll(tester2.address, 1);

      await NFT.connect(tester2).setAdmin(tester3.address, 1);  
      expect(await NFT.adminOf(1)).to.equal(tester3.address);
    });

    it("Should allow admin token approved to set admin", async function () {
      await NFT.mint();
      await NFT.setAdmin(tester1.address, 1);

      await expect(
        NFT.connect(tester2).setAdmin(tester3.address, 1)
      ).to.be.revertedWith("ERC721Lendable: set admin caller is not admin");
      await NFT.connect(tester1).approve(tester2.address, 1);

      await NFT.connect(tester2).setAdmin(tester3.address, 1);  
      expect(await NFT.adminOf(1)).to.equal(tester3.address);
    });
});