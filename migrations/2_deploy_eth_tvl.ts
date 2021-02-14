// @ts-ignore
let { ethers, upgrades } = require("hardhat");

async function deploy_tvl_main() {
    // * Deploying
    const EthPoolTVL = await ethers.getContractFactory("EthPoolTVL");
    const instance = await upgrades.deployProxy(EthPoolTVL, [1]);
    await instance.deployed();
}

deploy_tvl_main().then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });