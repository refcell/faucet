import { task, types } from "hardhat/config";
import { ImportantLog } from "./utils";
import { deployFusePoolFaucets, deployEthPoolFaucets, deploy, upgrade } from "./scripts";
import { upgradeFusePoolFaucets } from "./scripts/fuse/lib";

// task("deploy", "Deploy Script")
//     .setAction(deploy);

// task("upgrade", "Upgrade Script").setAction(upgrade);

// task("deploy_fuse", "Deploys all Faucets for Fuse Pools!")
//     .setAction(deployFusePoolFaucets);

// task("upgrade_fuse", "Upgrades Fuse Pool Faucets")
//     .setAction(upgradeFusePoolFaucets);

// task("deploy_eth_pool", "Deploys all Faucets for Eth Pool!")
//     .setAction(deployEthPoolFaucets);