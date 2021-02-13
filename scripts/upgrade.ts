// @ts-ignore
let { ethers, upgrades } = require("hardhat");
const inquirer = require("inquirer")
const fs = require('fs');

async function upgrade_main(address, new_contract) {
    // * Upgrading
    const upgraded_contract = await ethers.getContractFactory(new_contract);
    await upgrades.upgradeProxy(address, upgraded_contract);
}

fs.readdir("./contracts/", (err, files) => {
    files.forEach(file => {
        console.log(file);
    });
    inquirer
        .prompt([
            {
                name: "address",
                type: "input",
                message: "What is the contract address to upgrade?",
            },
            {
                name: "contract",
                type: "list",
                message: "Which is the upgraded contract?",
                choices: files,
            },
        ])
        .then((answer) => {
            upgrade_main(answer.address, answer.contract);
        });
});
