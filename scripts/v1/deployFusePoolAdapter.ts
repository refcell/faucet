import { FusePoolAdapterContract } from "@/typechain";
import { ImportantLog, checkDeployed, checkMainnet } from "../../utils";

const deployFusePoolAdapter = async ({ deployMainnet }, hre) => {
    // * Verify Mainnet Deployment
    checkMainnet({ deployMainnet }, hre);

    // * Dynamic imports
    const FusePoolAdapter = await hre.ethers.getContractFactory("FusePoolAdapter");
    const fusePoolAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"; // TODO: Update to mainnet address eventually
    const owner: any = process.env.DEPLOY_PUBLIC_KEY ? process.env.DEPLOY_PUBLIC_KEY : "0xd0ab35655E883Af9cD3fa164561C8aD93d427a62"

    // * Deploy FusePoolAdapter
    ImportantLog("Deploying an upgradeable FusePoolAdapter on " + hre.network.name + " | owner: " + process.env.DEPLOY_PUBLIC_KEY);
    const instance = await hre.upgrades.deployProxy(FusePoolAdapter, [owner, fusePoolAddress], { initializer: 'initialize', unsafeAllowCustomTypes: true, unsafeAllowLinkedLibraries: true });
    checkDeployed(hre, instance, []);

    return instance;
}

export default deployFusePoolAdapter;