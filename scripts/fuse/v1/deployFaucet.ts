import { ImportantLog, checkDeployed, checkMainnet, getOwner } from "../../../utils";

const deployFaucet = async ({ deployMainnet }, hre) => {
    // * Verify Mainnet Deployment
    checkMainnet({ deployMainnet }, hre);

    // * Dynamic imports
    const owner = getOwner();
    const Faucet = await hre.ethers.getContractFactory("Faucet");

    // * Deploy Faucet
    ImportantLog("Deploying an upgradeable Faucet on " + hre.network.name + " | owner: " + owner);
    const instance = await hre.upgrades.deployProxy(Faucet, [owner], { initializer: 'initialize' });
    checkDeployed(hre, instance, []);

    return instance;
}

export default deployFaucet;