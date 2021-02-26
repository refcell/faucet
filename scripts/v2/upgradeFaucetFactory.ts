import { ImportantLog, checkDeployed, checkMainnet } from "../../utils";

const upgradeFaucetFactory = async ({ deployMainnet }, hre) => {
    // * Verify Mainnet Deployment
    checkMainnet({ deployMainnet }, hre);

    // * Upgrade Faucet Factory
    ImportantLog("Upgradeing FaucetFactory on " + hre.network.name + " to FaucetFactoryV2 | owner: " + process.env.DEPLOY_PUBLIC_KEY);
    const proxyAddress = '0xFF60fd044dDed0E40B813DC7CE11Bed2CCEa501F';
    const FaucetFactoryV2 = await hre.ethers.getContractFactory("FaucetFactoryV2");
    const faucetFactoryV2 = await hre.upgrades.prepareUpgrade(proxyAddress, FaucetFactoryV2);
    checkDeployed(hre, FaucetFactoryV2, []);
    ImportantLog("Successfully deployed FaucetFactoryV2 at " + faucetFactoryV2 + " on " + hre.network.name + " | owner: " + process.env.DEPLOY_PUBLIC_KEY);
}

export default upgradeFaucetFactory;