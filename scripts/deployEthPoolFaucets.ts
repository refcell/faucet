
import { FaucetContract, FaucetFactoryInstance, FusePoolAdapterContract } from "../typechain";
import { Sleep, ImportantLog, RetryOperation } from "../utils";


const deployEthPoolFaucets = async ({ deployMainnet }, hre) => {
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

    const FusePoolAdapter: FusePoolAdapterContract = hre.artifacts.require("FusePoolAdapter");
    const constructorArgs: [] = [];

    ImportantLog(
        "Deploying a FusePoolAdapter with " +
        constructorArgs.join(", ") +
        " on " +
        hre.network.name + " | owner: " +
        process.env.DEPLOY_PUBLIC_KEY
    );

    const fusePoolAdapter = await FusePoolAdapter.new(...constructorArgs);
    let owner: any = process.env.DEPLOY_PUBLIC_KEY ? process.env.DEPLOY_PUBLIC_KEY : 0xd0ab35655E883Af9cD3fa164561C8aD93d427a62
    fusePoolAdapter.initialize(owner, '0x0');

    if(hre.network.name == "localhost" || hre.network.name == "development") {
        ImportantLog(
        `Deployed an Fuse Pool Adapter instance at ${fusePoolAdapter.address} on ${hre.network.name}!`
        );
    } else {
        ImportantLog("Deployed! Trying to verify in 10 seconds!");

        // Sleep for 10 seconds while Etherscan propogates.
        await Sleep(10000);

        // Verify on Etherscan and retry a max of 3 times with a 10 second delay in-between each try.
        await RetryOperation(
        () =>
            hre.run("verify", {
            network: hre.network.name,
            address: fusePoolAdapter.address,
            constructorArguments: constructorArgs,
            }),
        10000,
        3
        );

        ImportantLog(
        `Deployed an Eth Pool TVL instance at ${fusePoolAdapter.address} on ${hre.network.name}!`
        );
    }
}

export default deployEthPoolFaucets;