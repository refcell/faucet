import { FaucetFactoryContract } from "../../../typechain";
import { checkMainnet, ImportantLog } from "../../../utils";

const upgradeEthPoolFaucets = async ({ deployMainnet }, hre) => {
    // * Verify Mainnet Deployment
    checkMainnet({ deployMainnet }, hre);

    // TODO: IMPLEMENT
}

export default upgradeEthPoolFaucets;