const { ethers, upgrades } = require("hardhat");

async function main() {
  // * Deploying
  const TVL = await ethers.getContractFactory("TVL");
  const instance = await upgrades.deployProxy(TVL, [42]);
  await instance.deployed();
}

main();