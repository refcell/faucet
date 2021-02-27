import { boolean } from "hardhat/internal/core/params/argumentTypes";

const hre = require("hardhat");

const fusePoolAdapterAddress = "0x59b670e9fA9D0A427751Af201D676719a970857b";
const faucetFactoryAddress = "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44";
const faucetAddress = "0x763e69d24a03c0c8B256e470D9fE9e0753504D07";
const owner = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
const comptrollerAddress = "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B";

const main = async () => {
    const FaucetFactory = await hre.ethers.getContractFactory("FaucetFactory");
    const faucetFactory = await FaucetFactory.attach(faucetFactoryAddress);
    let faucets = await faucetFactory.getAllFaucets.call();
    console.log(faucets);

    const Faucet = await hre.ethers.getContractFactory("Faucet");
    const faucet = await Faucet.attach(faucetAddress);
    console.log(faucet);

    await faucetFactory.deployFaucet(owner, "http://test.com/{id}.json", fusePoolAdapterAddress);
    faucets = await faucetFactory.getAllFaucets.call();
    console.log(faucets);

    // * Mint tokens and create tranche
    const faucet2 = await Faucet.attach(faucets[0]);
    await faucet2.mintItem(1, 10, "0x01");
    console.log("Minted 10 of token id 1!");
    await faucet2.mintItem(2, 20, "0x02");
    console.log("Minted 20 of token id 2!");
    await faucet2.mintItem(3, 30, "0x03");
    console.log("Minted 30 of token id 3!");
    let createdTranche = false;
    let trancheId = 1;
    while(!createdTranche) {
        try {
            await faucet2.createTranche(trancheId, [1, 2, 3], "0x01", true, { from: owner });
            createdTranche = true;
            console.log("Sucessfully created tranche with id:", trancheId);
        } catch (e) {
            console.log("Failed to create tranche with id:", trancheId)
            trancheId++;
        }
    }
    console.log("Minted 3 tokens with amounts [10, 20, 30] and created tranche with id 1 and 3 token levels");

    // * Set user tranche level
    await faucet2.setUserTrancheLevel(1, owner, {from: owner});

    // const Comptroller = await hre.ethers.getContractFactory("Comptroller");
    const FusePoolAdapter = await hre.ethers.getContractFactory("FusePoolAdapter");
    const fusePoolAdapter = await FusePoolAdapter.attach(fusePoolAdapterAddress);
    await fusePoolAdapter['setPoolAddress(address)'](comptrollerAddress, {from: owner});
    console.log("Fuse Pool Adapter set address to:", comptrollerAddress);
    
    // * Sanity Check
    const newAddress = await fusePoolAdapter.getPoolAddress();
    console.log("sanity check new address:", newAddress);
    const adapterAddress = await faucet2.getAdapterAddress();
    console.log("adapter address:", adapterAddress);
    
    let myPoolShare = await faucet2.getPoolShare(owner, 100, { from: owner });
    // myPoolShare = await myPoolShare.wait();
    console.log("my pool share: ", myPoolShare);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

export {}