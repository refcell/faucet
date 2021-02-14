// @ts-ignore
let { ethers, upgrades } = require("hardhat");

async function initial_migration_main() {
    // * Deploying
    const Migrations = await ethers.getContractFactory("Migrations");
    const instance = await ethers.deploy(Migrations);
    await instance.deployed();
}

initial_migration_main();


const Migrations = artifacts.require('@/contracts/Migrations.sol')
const fs = require('fs')
const getNetworkFile = require('../helpers/ZosNetworkFile.js')

module.exports = async function initialMigration(deployer) {
  // If the network is `--reset`, then also delete the ZOS configuration so that ZOS resets.
  // This prevents an error where ZOS attempts to use a proxy which does not exist any longer.
  const networkFile = await getNetworkFile(web3)
  fs.unlink(networkFile.filePath, () => {})

  await deployer.deploy(Migrations)
}