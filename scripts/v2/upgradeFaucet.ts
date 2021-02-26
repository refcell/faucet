import { ImportantLog, checkDeployed, checkMainnet } from "../../utils";

const upgradeFaucet = async ({ deployMainnet }, hre) => {
    // * Verify Mainnet Deployment
    checkMainnet({ deployMainnet }, hre);

    // * Upgrade Faucet
    ImportantLog("Upgradeing Faucet on " + hre.network.name + " to FaucetV2 | owner: " + process.env.DEPLOY_PUBLIC_KEY);
    const proxyAddress = '0xFF60fd044dDed0E40B813DC7CE11Bed2CCEa501F';
    const FaucetV2 = await hre.ethers.getContractFactory("FaucetV2");
    const faucetV2 = await hre.upgrades.prepareUpgrade(proxyAddress, FaucetV2);
    checkDeployed(hre, FaucetV2, []);
    ImportantLog("Successfully deployed FaucetV2 at " + faucetV2 + " on " + hre.network.name + " | owner: " + process.env.DEPLOY_PUBLIC_KEY);
}

export default upgradeFaucet;