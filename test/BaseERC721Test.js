const { ethers } = require("hardhat");
const { expect } = require("chai");


describe("Base ERC721", function () {
  it("Should assign owner when minted", async function () {
    const [owner] = await ethers.getSigners();
    const [ownerAddr] =  await Promise.all([owner].map(async x => await x.getAddress()));

    const NFTFactory = await ethers.getContractFactory("TestNFT");
    const NFT = await NFTFactory.deploy();

    await NFT.mint();
    expect(await NFT.ownerOf(1)).to.equal(ownerAddr);
    await NFT.mint();
    expect(await NFT.ownerOf(2)).to.equal(ownerAddr);
  });

  it("Should assign new owner on transfer", async function () {
    const [owner, tester1] = await ethers.getSigners();
    const [ownerAddr, tester1Addr] =  await Promise.all([owner, tester1].map(async x => await x.getAddress()));

    const NFTFactory = await ethers.getContractFactory("TestNFT");
    const NFT = await NFTFactory.deploy();

    await NFT.mint();
    expect(await NFT.ownerOf(1)).to.equal(ownerAddr);

    await NFT.transferFrom(ownerAddr, tester1Addr, 1);
    expect(await NFT.ownerOf(1)).to.equal(tester1Addr);
  });

  it("Should allow transfer after approval", async function () {
    const [owner, tester1, tester2] = await ethers.getSigners();
    const [ownerAddr, tester1Addr, tester2Addr] =  await Promise.all([owner, tester1, tester2].map(async x => await x.getAddress()));

    const NFTFactory = await ethers.getContractFactory("TestNFT");
    const NFT = await NFTFactory.deploy();

    await NFT.mint();

    await expect(
        NFT.connect(tester1).transferFrom(ownerAddr, tester2Addr, 1)
    ).to.be.revertedWith("ERC721Lendable: transfer caller is not admin");
    await NFT.approve(tester1Addr, 1);

    expect(await NFT.ownerOf(1)).to.equal(ownerAddr);
    await NFT.connect(tester1).transferFrom(ownerAddr, tester2Addr, 1);
    expect(await NFT.ownerOf(1)).to.equal(tester2Addr);
  });
});