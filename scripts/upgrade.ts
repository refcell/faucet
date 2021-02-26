// * Import helper functions
const { upgradeEthPoolFaucets } = require("./upgradeEthPoolFaucets");
const { upgradeFusePoolFaucets } = require("./upgradeFusePoolFaucets");

// * Import types
import { DeployFunction } from 'hardhat-deploy/types';
import {HardhatRuntimeEnvironment} from 'hardhat/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const inquirer = require('inquirer');
    inquirer
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
            await upgradeFusePoolFaucets({ deployMainnet: false }, hre);
        } else if (answers.upgrade == "Eth Pool") {
            await upgradeEthPoolFaucets({ deployMainnet: false }, hre);
        }
    })
    .catch(error => {
        console.log("ERROR");
        console.warn(error)
    });
};

export default func;