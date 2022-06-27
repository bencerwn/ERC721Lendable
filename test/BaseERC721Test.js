const { ethers } = require("hardhat");
const { expect } = require("chai");


describe("Base ERC721", function () {
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


    it("Should assign owner when minted", async function () {
        await NFT.mint();
        expect(await NFT.ownerOf(1)).to.equal(owner.address);

        await NFT.mint();
        expect(await NFT.ownerOf(2)).to.equal(owner.address);
    });

    it("Should assign new owner on transfer", async function () {
        await NFT.mint();
        expect(await NFT.ownerOf(1)).to.equal(owner.address);

        await NFT.transferFrom(owner.address, tester1.address, 1);
        expect(await NFT.ownerOf(1)).to.equal(tester1.address);
    });

    it("Should allow transfer after approval", async function () {
        await NFT.mint();

        await expect(
            NFT.connect(tester1).transferFrom(owner.address, tester2.address, 1)
        ).to.be.revertedWith("ERC721Lendable: transfer caller is not admin");
        await NFT.approve(tester1.address, 1);

        expect(await NFT.ownerOf(1)).to.equal(owner.address);
        await NFT.connect(tester1).transferFrom(owner.address, tester2.address, 1);
        expect(await NFT.ownerOf(1)).to.equal(tester2.address);

        await expect(
            NFT.transferFrom(tester2.address, owner.address, 1)
        ).to.be.revertedWith("ERC721Lendable: transfer caller is not admin");
    });
});