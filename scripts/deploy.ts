// @ts-ignore
let { ethers, upgrades } = require("hardhat");

async function deploy_main() {
  // * Deploy Migrations
  const Migrations = await ethers.getContractFactory("Migrations");
  // const migration_instance = Migrations.new();

  // * Deploy TVL
  const TVL = await ethers.getContractFactory("TVL");
  const tvl_instance = await upgrades.deployProxy(TVL, [42]);
  let owner = process.env.DEV_PUBLIC_KEY ? process.env.DEV_PUBLIC_KEY : 0xd0ab35655E883Af9cD3fa164561C8aD93d427a62
  await tvl_instance.initialize(owner);
  await tvl_instance.deployed();
}

deploy_main();