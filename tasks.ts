import { task, types } from "hardhat/config";

import { TVLContract } from "./typechain";

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function importantLog(msg: any) {
    console.log();
    console.log(msg);
    console.log();
}

function retryOperation(operation: () => any, delay: number, retries: number) {
    return new Promise((resolve, reject) => {
        return operation()
        .then(resolve)
        .catch((reason) => {
            if (retries > 0) {
            importantLog(
                `Failed to run task. Trying again after ${
                delay / 1000
                } seconds. Trying a max of ${
                retries - 1
                } more times after this next run.`
            );

            return sleep(delay)
                .then(retryOperation.bind(null, operation, delay, retries - 1))
                .then(resolve)
                .catch(reject);
            }
            return reject(reason);
        });
    });
}

task("deploy", "Deploys a TVL contract.")
    .addOptionalParam(
        "deployMainnet",
        "You must pass this flag if the network you are trying to deploy to is mainnet.",
        false,
        types.boolean
    )
    .setAction(async function (
        {
            deployMainnet
        },
        hre
    ) {
        // Require use of deployMainnet flag for mainnet deploys.
        if (deployMainnet && hre.network.name !== "mainnet") {
        importantLog(
            "Only use the --deploy-mainnet flag if you are using the mainnet network!"
        );
        return;
        }

        // Require that the deployMainnet flag only be used with the mainnet network to prevent finger slips if it is left on the end.
        if (hre.network.name === "mainnet" && !deployMainnet) {
        importantLog(
            "If you want to deploy to mainnet you must use the --deploy-mainnet flag!"
        );
        return;
        }

        const TVL: TVLContract = hre.artifacts.require("TVL");

        const constructorArgs: [] = [];

        importantLog(
            "Deploying a TVL with " +
            constructorArgs.join(", ") +
            " on " +
            hre.network.name
        );

        const tvl = await TVL.new(...constructorArgs);

        importantLog("Deployed! Trying to verify in 10 seconds!");

        // Sleep for 10 seconds while Etherscan propogates.
        await sleep(10000);

        // Verify on Etherscan and retry a max of 3 times with a 10 second delay in-between each try.
        await retryOperation(
        () =>
            hre.run("verify", {
            network: hre.network.name,
            address: tvl.address,
            constructorArguments: constructorArgs,
            }),
        10000,
        3
        );

        importantLog(
        `Deployed a TVL instance at ${tvl.address} on ${hre.network.name}!`
        );
    }
);
