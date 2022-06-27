const { ethers } = require("hardhat");
const { expect } = require("chai");


describe("Base ERC721", function () {
  it("Should assign owner when minted", async function () {
    const [owner] = await ethers.getSigners();

    const NFTFactory = await ethers.getContractFactory("TestNFT");
    const NFT = await NFTFactory.deploy();

    await NFT.mint();
    expect(await NFT.ownerOf(1)).to.equal(owner.address);
    await NFT.mint();
    expect(await NFT.ownerOf(2)).to.equal(owner.address);
  });

  it("Should assign new owner on transfer", async function () {
    const [owner, tester1] = await ethers.getSigners();

    const NFTFactory = await ethers.getContractFactory("TestNFT");
    const NFT = await NFTFactory.deploy();

    await NFT.mint();
    expect(await NFT.ownerOf(1)).to.equal(owner.address);

    await NFT.transferFrom(owner.address, tester1.address, 1);
    expect(await NFT.ownerOf(1)).to.equal(tester1.address);
  });

  it("Should allow transfer after approval", async function () {
    const [owner, tester1, tester2] = await ethers.getSigners();

    const NFTFactory = await ethers.getContractFactory("TestNFT");
    const NFT = await NFTFactory.deploy();

    await NFT.mint();

    await expect(
        NFT.connect(tester1).transferFrom(owner.address, tester2.address, 1)
    ).to.be.revertedWith("ERC721Lendable: transfer caller is not admin");
    await NFT.approve(tester1.address, 1);

    expect(await NFT.ownerOf(1)).to.equal(owner.address);
    await NFT.connect(tester1).transferFrom(owner.address, tester2.address, 1);
    expect(await NFT.ownerOf(1)).to.equal(tester2.address);
  });
});