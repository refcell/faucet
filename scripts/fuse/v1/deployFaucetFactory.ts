import { ImportantLog, checkDeployed, checkMainnet, getOwner } from "../../../utils";

const deployFaucetFactory = async ({ deployMainnet }, hre) => {
    // * Verify Mainnet Deployment
    checkMainnet({ deployMainnet }, hre);

    // * Dynamic imports
    const FaucetFactory = await hre.ethers.getContractFactory("FaucetFactory");
    const owner = getOwner();

    // * Deploy FaucetFactory
    ImportantLog("Deploying an upgradeable FaucetFactory on " + hre.network.name + " | owner: " + owner);
    const instance = await hre.upgrades.deployProxy(FaucetFactory, [owner], { initializer: 'initialize', unsafeAllowCustomTypes: true, unsafeAllowLinkedLibraries: true });
    checkDeployed(hre, instance, []);

    return instance;
}

export default deployFaucetFactory;