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


    it("", async function () {
        await NFT.mint();
    });
});