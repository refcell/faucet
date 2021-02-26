import { ImportantLog, checkDeployed, checkMainnet } from "../../utils";

const upgradeFusePoolAdapter = async ({ deployMainnet }, hre) => {
    // * Verify Mainnet Deployment
    checkMainnet({ deployMainnet }, hre);

    // * Upgrade Fuse Pool Adapter
    ImportantLog("Upgradeing FusePoolAdapter on " + hre.network.name + " to FusePoolAdapterV2 | owner: " + process.env.DEPLOY_PUBLIC_KEY);
    const proxyAddress = '0xFF60fd044dDed0E40B813DC7CE11Bed2CCEa501F';
    const FusePoolAdapterV2 = await hre.ethers.getContractFactory("FusePoolAdapterV2");
    const fusePoolAdapterV2 = await hre.upgrades.prepareUpgrade(proxyAddress, FusePoolAdapterV2);
    checkDeployed(hre, FusePoolAdapterV2, []);
    ImportantLog("Successfully deployed FusePoolAdapterV2 at " + fusePoolAdapterV2 + " on " + hre.network.name + " | owner: " + process.env.DEPLOY_PUBLIC_KEY);
}

export default upgradeFusePoolAdapter;