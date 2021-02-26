
import { FaucetContract, FaucetFactoryContract, FusePoolAdapterContract } from "../typechain";
import { ImportantLog, checkDeployed } from "../utils";

const deployFusePoolFaucets = async ({ deployMainnet }, hre) => {
    // * Require use of deployMainnet flag for mainnet deploys.
    if (deployMainnet && hre.network.name !== "mainnet") {
        ImportantLog("Only use the --deploy-mainnet flag if you are using the mainnet network!");
        return;
    }
    // * Require that the deployMainnet flag only be used with the mainnet network to prevent finger slips if it is left on the end.
    if (hre.network.name === "mainnet" && !deployMainnet) {
        ImportantLog("If you want to deploy to mainnet you must use the --deploy-mainnet flag!");
        return;
    }

    // * Define Major Scope Constants
    const constructorArgs: [] = [];
    // const FusePoolAdapter: FusePoolAdapterContract = hre.artifacts.require("FusePoolAdapter");
    const FaucetFactory: FaucetFactoryContract = hre.artifacts.require("FaucetFactory");
    const Faucet: FaucetContract = hre.artifacts.require("Faucet");
    const fusePoolAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"; // TODO: Update to mainnet address eventually
    const faucetUri = "https://rari.capital/api/{id}.json"
    const owner: any = process.env.DEPLOY_PUBLIC_KEY ? process.env.DEPLOY_PUBLIC_KEY : "0xd0ab35655E883Af9cD3fa164561C8aD93d427a62"

    // * First deploy the Fuse Pool Adapter with the Fuse Pool Address
    ImportantLog("Deploying a FusePoolAdapter on " + hre.network.name + " | owner: " + process.env.DEPLOY_PUBLIC_KEY);
    const FusePoolAdapter = await hre.ethers.getContractFactory("FusePoolAdapter");
    const instance = await FusePoolAdapter.deploy();
    await instance.deployed();
    console.log("Deployed? ", instance !== null);
    // const fusePoolAdapter = await FusePoolAdapter.deploy();
    // const fusePoolAdapter: any = await FusePoolAdapter.new();
    await instance.initialize(owner, fusePoolAddress);
    checkDeployed(hre, instance, constructorArgs);

    // * Deploy FaucetFactory
    ImportantLog("Deploying a FaucetFactory on " + hre.network.name + " | owner: " + process.env.DEPLOY_PUBLIC_KEY);
    const faucetFactory = await FaucetFactory.new();
    await faucetFactory.initialize(owner);
    checkDeployed(hre, faucetFactory, constructorArgs);


    // * Deploy new Faucet with the given Fuse Pool Adapter Address
    ImportantLog("Deploying a Faucet on " + hre.network.name + " | owner: " + process.env.DEPLOY_PUBLIC_KEY);
    const new_faucet_address = await faucetFactory.deployFaucet.call(owner, faucetUri, instance.address);
    await faucetFactory.deployFaucet(owner, faucetUri, instance.address);
    // @ts-ignore
    const faucet = await Faucet.at(new_faucet_address);
    checkDeployed(hre, faucet, constructorArgs);

    // * Add Faucet owner as admin to adapter
    // await fusePoolAdapter.addApprovedAdmin(new_faucet_address, { from: owner });
}

export default deployFusePoolFaucets;

export {
    deployFusePoolFaucets
}