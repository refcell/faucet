import { ImportantLog, checkDeployed, checkMainnet, getOwner } from "../../../utils";

const upgradeFusePoolAdapter = async ({ deployMainnet }, hre) => {
    // * Verify Mainnet Deployment
    checkMainnet({ deployMainnet }, hre);

    // * Upgrade Fuse Pool Adapter
    const owner = getOwner();
    ImportantLog("Upgradeing FusePoolAdapter on " + hre.network.name + " to FusePoolAdapterV2 | owner: " + owner);
    const proxyAddress = '0x59b670e9fA9D0A427751Af201D676719a970857b';
    const FusePoolAdapter = await hre.ethers.getContractFactory("FusePoolAdapter");
    const fusePoolAdapter = await hre.upgrades.prepareUpgrade(proxyAddress, FusePoolAdapter);
    checkDeployed(hre, fusePoolAdapter, []);
    ImportantLog("Successfully deployed upgraded FusePoolAdapter at " + fusePoolAdapter + " on " + hre.network.name + " | owner: " + owner);
    // * Add Faucet owner as admin to adapter
    console.log(fusePoolAdapter);
    await fusePoolAdapter.addApprovedAdmin(owner, { from: owner });
    return fusePoolAdapter;
}

export default upgradeFusePoolAdapter;