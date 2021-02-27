// * Import helper functions
import { deployFusePoolFaucets } from "./lib";

// * Import types
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    await deployFusePoolFaucets(hre);
};

export default func;