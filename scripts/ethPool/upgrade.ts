// * Import helper functions
import { upgradeEthPoolFaucets } from "./lib"

// * Import types
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    await upgradeEthPoolFaucets({ deployMainnet: false }, hre);
};

export default func;