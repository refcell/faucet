import { ImportantLog } from ".";

const checkMainnet = ({ deployMainnet }, hre) => {
    // * Require use of deployMainnet flag for mainnet deploys.
    if (deployMainnet && hre.network.name !== "mainnet") {
        ImportantLog("Only use the --deploy-mainnet flag if you are using the mainnet network!");
        return;
    }
    // * Require that the deployMainnet flag only be used with the mainnet network to prevent finger slips if it is left on the end.
    if (hre.network.name === "mainnet" && !deployMainnet) {
        ImportantLog("If you want to deploy to mainnet you must use the --deploy-mainnet flag!");
        return;
    }
}

export default checkMainnet;