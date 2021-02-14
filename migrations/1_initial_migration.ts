// @ts-ignore
let { ethers, upgrades } = require("hardhat");

async function initial_migration_main() {
    // * Deploying
    const Migrations = await ethers.getContractFactory("Migrations");
    const instance = await ethers.deploy(Migrations);
    await instance.deployed();
}

initial_migration_main();