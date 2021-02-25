const { deployEthPoolFaucets } = require("./deployEthPoolFaucets");
const { deployFusePoolFaucets } = require("./deployFusePoolFaucets");
const hre = require("hardhat");

const inquirer = require('inquirer');

inquirer
    .prompt([
        {
            name: "deploy_select",
            type: "list",
            message: "Deploy Faucets for:",
            choices: ["Fuse Pools!", "Eth Pool!"],
        },
        {
            name: "network",
            type: "list",
            message: "Deploy to ",
            choices: ["localhost", "ropsten", "mainnet"],
        }
    ])
    .then(async answers => {
        let isMainnet = answers.newtork == "mainnet" ? true : false;
        if(answers.deploy_select == "Fuse Pools!") {
            await deployFusePoolFaucets({ deployMainnet: isMainnet }, hre);
        } else if (answers.deploy_select == "Eth Pool!") {
            await deployEthPoolFaucets({ deployMainnet: isMainnet }, hre);
        }
    })
    .catch(error => {
        console.log("ERROR");
        console.warn(error)
    });

export {}