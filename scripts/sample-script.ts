const hre = require("hardhat");

async function main() {
  // * We get the contract to deploy
  const TVL = await hre.ethers.getContractFactory("TVL");
  const tvl = await TVL.deploy("Hello, Hardhat!");

  await tvl.deployed();

  console.log("TVL deployed to:", tvl.address);
}

// * async/await pattern
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
