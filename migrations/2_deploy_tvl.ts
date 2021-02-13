// @ts-ignore
let { ethers, upgrades } = require("hardhat");

async function deploy_tvl_main() {
    // * Deploying
    const TVL = await ethers.getContractFactory("TVL");
    console.log("Deploying TVL with Migrations Proxy")
    const instance = await upgrades.deployProxy(TVL, [1]);
    console.log("TVL deployed to:", instance);
    await instance.deployed();
}

deploy_tvl_main().then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });