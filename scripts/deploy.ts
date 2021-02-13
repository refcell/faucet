// @ts-ignore
let { ethers, upgrades } = require("hardhat");

async function deploy_main() {
  // * Deploy Migrations
  const Migrations = await ethers.getContractFactory("Migrations");
  // const migration_instance = Migrations.new();

  // * Deploy TVL
  const TVL = await ethers.getContractFactory("TVL");
  const tvl_instance = await upgrades.deployProxy(TVL, [42]);
  await tvl_instance.deployed();
}

deploy_main();