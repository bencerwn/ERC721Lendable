const { ethers } = require("hardhat");
const { expect } = require("chai");


describe("Admin Test", function () {
    let owner;
    let tester1;
    let tester2;
    let NFTFactory;
    let NFT;
    
    beforeEach(async function () {
        [owner, tester1, tester2] = await ethers.getSigners();
        NFTFactory = await ethers.getContractFactory("TestNFT");
        NFT = await NFTFactory.deploy();
    });


    it("Should set admin correctly", async function () {
        await NFT.mint();
        expect(await NFT.ownerOf(1)).to.equal(owner.address);

        await NFT.setAdmin(tester1.address, 1);
        expect(await NFT.ownerOf(1)).to.equal(owner.address);
        expect(await NFT.adminOf(1)).to.equal(tester1.address);
    });
});