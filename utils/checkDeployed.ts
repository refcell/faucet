import { ImportantLog, RetryOperation, Sleep } from ".";

const checkDeployed = async (hre: any, myContract: any, constructorArgs: any) => {
    if(hre.network.name == "localhost" || hre.network.name == "development") {
        ImportantLog(
        `Deployed at ${myContract.address} on ${hre.network.name}!`
        );
    } else {
        ImportantLog(`Deployed at ${myContract.address} on ${hre.network.name}! Trying to verify in 10 seconds!`);

        // Sleep for 10 seconds while Etherscan propogates.
        await Sleep(10000);

        // Verify on Etherscan and retry a max of 3 times with a 10 second delay in-between each try.
        await RetryOperation(
        () =>
            hre.run("verify", {
            network: hre.network.name,
            address: myContract.address,
            constructorArguments: constructorArgs,
            }),
        10000,
        3
        );

        ImportantLog(
        `Deployed an Eth Pool TVL instance at ${myContract.address} on ${hre.network.name}!`
        );
    }
}

export default checkDeployed;