import { FaucetFactoryContract } from "../../../typechain";
import { checkMainnet, getOwner, ImportantLog } from "../../../utils";
import { upgradeFaucetFactory, upgradeFusePoolAdapter } from "../v2";

const upgradeFusePoolFaucets = async (hre) => {
    // * Verify Mainnet Deployment
    checkMainnet({ deployMainnet: false }, hre);

    // * Define Major Scope Constants
    const FaucetFactory: FaucetFactoryContract = await artifacts.require("FaucetFactory");
    const faucetUri = "https://rari.capital/api/{id}.json"
    const owner = getOwner();

    // * Deploy FusePoolAdapter
    const FusePoolAdapter = await upgradeFusePoolAdapter({ deployMainnet: false }, hre);

    // * Deploy FaucetFactory
    const faucetFactory = await upgradeFaucetFactory({ deployMainnet: false }, hre);

    // * Deploy new Faucet with the given Fuse Pool Adapter Address
    ImportantLog("Deploying a Faucet on " + hre.network.name + " | owner: " + owner);
    const FaucetFactoryInstance = await FaucetFactory.new(faucetFactory.address);
    const instance = await FaucetFactoryInstance.deployFaucet.call(owner, faucetUri, FusePoolAdapter.address);
    await FaucetFactoryInstance.deployFaucet(owner, faucetUri, FusePoolAdapter.address, { from: owner });
    ImportantLog("Deployed a Faucet at " + instance + " on " + hre.network.name + " | owner: " + owner);

    // * Add Faucet owner as admin to adapter
    await FusePoolAdapter.addApprovedAdmin(instance, { from: owner });
}

export default upgradeFusePoolFaucets;