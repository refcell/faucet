// * Import helper functions
import { deployEthPoolFaucets } from "./lib";

// * Import types
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    await deployEthPoolFaucets({ deployMainnet: false }, hre);
};

export default func;