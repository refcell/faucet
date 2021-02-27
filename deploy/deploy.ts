// * Import helper functions
import { deploy, upgrade } from '../scripts';

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
            name: "deploy",
            type: "list",
            message: "Type of Deployment",
            choices: ["deploy", "upgrade v2"],
        }
    ])
    .then(async answers => {
        if(answers.deploy == "deploy") {
            await deploy(hre);
        } else if (answers.deploy == "upgrade v2") {
            await upgrade(hre);
        }
    })
    .catch(error => {
        console.log("ERROR");
        console.warn(error)
    });
};

export default func;