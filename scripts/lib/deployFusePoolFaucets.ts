import { FaucetFactoryContract } from "@/typechain";
import { ImportantLog } from "../../utils";
import { deployFaucetFactory, deployFusePoolAdapter } from "../v1";

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
    const FaucetFactory: FaucetFactoryContract = await artifacts.require("FaucetFactory");
    const faucetUri = "https://rari.capital/api/{id}.json"
    const owner: any = process.env.DEPLOY_PUBLIC_KEY ? process.env.DEPLOY_PUBLIC_KEY : "0xd0ab35655E883Af9cD3fa164561C8aD93d427a62"

    // * Deploy FusePoolAdapter
    const FusePoolAdapter = await deployFusePoolAdapter({ deployMainnet }, hre);

    // * Deploy FaucetFactory
    const faucetFactory = await deployFaucetFactory({ deployMainnet }, hre);

    // * Deploy new Faucet with the given Fuse Pool Adapter Address
    ImportantLog("Deploying a Faucet on " + hre.network.name + " | owner: " + process.env.DEPLOY_PUBLIC_KEY);
    const FaucetFactoryInstance = await FaucetFactory.new(faucetFactory.address);
    const instance = await FaucetFactoryInstance.deployFaucet.call(owner, faucetUri, FusePoolAdapter.address);
    await FaucetFactoryInstance.deployFaucet(owner, faucetUri, FusePoolAdapter.address, { from: owner });
    ImportantLog("Deployed a Faucet at " + instance + " on " + hre.network.name + " | owner: " + process.env.DEPLOY_PUBLIC_KEY);

    // * Add Faucet owner as admin to adapter
    await FusePoolAdapter.addApprovedAdmin(instance, { from: owner });
}

export default deployFusePoolFaucets;