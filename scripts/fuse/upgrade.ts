// * Import helper functions
import { upgradeFusePoolFaucets } from "./lib"

// * Import types
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    await upgradeFusePoolFaucets(hre);
};

export default func;