// * Import helper functions
import { deployFusePoolFaucets } from "./fuse";
import { deployEthPoolFaucets } from "./ethPool";

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
            name: "deploy_select",
            type: "list",
            message: "Deploy Faucets for:",
            choices: ["Fuse Pools!", "Eth Pool!"],
        }
    ])
    .then(async answers => {
        if(answers.deploy_select == "Fuse Pools!") {
            await deployFusePoolFaucets(hre);
        } else if (answers.deploy_select == "Eth Pool!") {
            await deployEthPoolFaucets(hre);
        }
    })
    .catch(error => {
        console.log("ERROR");
        console.warn(error)
    });
};

export default func;