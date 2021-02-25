import { task, types } from "hardhat/config";
import { ImportantLog } from "./utils";
import { deployFusePoolFaucets, deployEthPoolFaucets } from "./scripts";

task("deploy_fuse", "Deploys all Faucets for Fuse Pools!")
    .addOptionalParam("deployMainnet", "Must be passed for Mainnet!", false, types.boolean)
    .setAction(deployFusePoolFaucets);

task("deploy_eth_pool", "Deploys all Faucets for Eth Pool!")
    .addOptionalParam("deployMainnet", "Must be passed for Mainnet!", false, types.boolean)
    .setAction(deployEthPoolFaucets);