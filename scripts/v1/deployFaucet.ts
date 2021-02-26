import { FaucetContract } from "@/typechain";
import { ImportantLog, checkDeployed, checkMainnet } from "../../utils";

const deployFaucet = async ({ deployMainnet }, hre) => {
    // * Verify Mainnet Deployment
    checkMainnet({ deployMainnet }, hre);

    // * Dynamic imports
    const Faucet = await hre.ethers.getContractFactory("Faucet");
    const owner: any = process.env.DEPLOY_PUBLIC_KEY ? process.env.DEPLOY_PUBLIC_KEY : "0xd0ab35655E883Af9cD3fa164561C8aD93d427a62"

    // * Deploy Faucet
    ImportantLog("Deploying an upgradeable Faucet on " + hre.network.name + " | owner: " + process.env.DEPLOY_PUBLIC_KEY);
    const instance = await hre.upgrades.deployProxy(Faucet, [owner], { initializer: 'initialize' });
    checkDeployed(hre, instance, []);

    return instance;
}

export default deployFaucet;