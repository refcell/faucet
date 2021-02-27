// * Import helper functions
import { upgradeFusePoolFaucets } from "./fuse";
import { upgradeEthPoolFaucets } from "./ethPool";

// * Import types
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    if(!hre || Object.keys(hre).length == 0) {
        const myhre = require("hardhat");
        hre = myhre;
    }
    const inquirer = require('inquirer');
    await inquirer
    .prompt([
        {
            name: "upgrade",
            type: "list",
            message: "Upgrade contracts for:",
            choices: ["Fuse Pools", "Eth Pool"],
        }
    ])
    .then(async answers => {
        if(answers.upgrade == "Fuse Pools") {
            await upgradeFusePoolFaucets(hre);
        } else if (answers.upgrade == "Eth Pool") {
            await upgradeEthPoolFaucets(hre);
        }
    })
    .catch(error => {
        console.log("ERROR");
        console.warn(error)
    });
};

export default func;