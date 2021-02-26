import { FaucetFactoryContract } from "@/typechain";
import { ImportantLog, checkDeployed, checkMainnet } from "../../utils";

const deployFaucetFactory = async ({ deployMainnet }, hre) => {
    // * Verify Mainnet Deployment
    checkMainnet({ deployMainnet }, hre);

    // * Dynamic imports
    const FaucetFactory = await hre.ethers.getContractFactory("FaucetFactory");
    const owner: any = process.env.DEPLOY_PUBLIC_KEY ? process.env.DEPLOY_PUBLIC_KEY : "0xd0ab35655E883Af9cD3fa164561C8aD93d427a62"

    // * Deploy FaucetFactory
    ImportantLog("Deploying an upgradeable FaucetFactory on " + hre.network.name + " | owner: " + process.env.DEPLOY_PUBLIC_KEY);
    const instance = await hre.upgrades.deployProxy(FaucetFactory, [owner], { initializer: 'initialize', unsafeAllowCustomTypes: true, unsafeAllowLinkedLibraries: true });
    checkDeployed(hre, instance, []);

    return instance;
}

export default deployFaucetFactory;