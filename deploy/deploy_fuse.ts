// * Import helper functions
const { deployEthPoolFaucets } = require("../scripts/deployEthPoolFaucets");
const { deployFusePoolFaucets } = require("../scripts/deployFusePoolFaucets");

// * Import types
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    await deployFusePoolFaucets({ deployMainnet: false }, hre);
};

export default func;