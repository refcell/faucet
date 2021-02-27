import { ImportantLog, checkDeployed, checkMainnet, getOwner } from "../../../utils";

const deployFusePoolAdapter = async ({ deployMainnet }, hre) => {
    // * Verify Mainnet Deployment
    checkMainnet({ deployMainnet }, hre);

    // * Dynamic imports
    const FusePoolAdapter = await hre.ethers.getContractFactory("FusePoolAdapter");
    const fusePoolAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"; // TODO: Update to mainnet address eventually
    const owner = getOwner();

    // * Deploy FusePoolAdapter
    ImportantLog("Deploying an upgradeable FusePoolAdapter on " + hre.network.name + " | owner: " + owner);
    const instance = await hre.upgrades.deployProxy(FusePoolAdapter, [owner, fusePoolAddress], { initializer: 'initialize', unsafeAllowCustomTypes: true, unsafeAllowLinkedLibraries: true });
    checkDeployed(hre, instance, []);

    return instance;
}

export default deployFusePoolAdapter;