const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Base ERC721", function () {
  it("Should assign owner when minted", async function () {
    const [owner] = await ethers.getSigners();

    const NFTFactory = await ethers.getContractFactory("TestNFT");
    const NFT = await NFTFactory.deploy();

    await NFT.mint();
    expect(await NFT.ownerOf(1)).to.equal(await owner.getAddress());
  });
});