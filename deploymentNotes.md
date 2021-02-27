# Deployed Contracts

## Interacting with the Hardhat console

<b>Get the FaucetFactory Contract Definition</b>

> const FaucetFactory = await ethers.getContractFactory("FaucetFactory");

<b>Get FaucetFactory Instance</b>

> const faucetFactory = await FaucetFactory.attach("0xe02745875f8F30d12E3cFd1B1B975ba96cFE4De1");

<b>Get All Faucets</b>

> let faucets = await faucetFactory.getAllFaucets.call();

<b>Output faucets</b>

> faucets

<b>Get Faucet Contract Defintions</b>

> const Faucet = await ethers.getContractFactory("Faucet");

<b>Attach Deployed Faucet Instance</b>

> const faucet = await Faucet.attach("0xFa219eCeD2B8ED3BA935aa5Ebc2eB59ed633d32B");

<b>Output Faucet Instance</b>

> faucet

<b>Deploy new Faucet with FaucetFactory</b>

> await faucetFactory.deployFaucet("0x70FD938dE9199F4650c7a97B2Ebb1AF98B4733C9", "http://test.com/{id}.json", "0xB158150d3544D6ff49993E6B77702B20eB13b34f");

<b>Get All Faucets</b>

> let faucets = await faucetFactory.getAllFaucets.call();

<b>Output faucets</b>

> faucets

<b>Attach Deployed Faucet Instance</b>

> const faucet = await Faucet.attach("0x0f9D0c39f1F6517D8E882D5fC98FBb92B2C1f646");

<b>Mint a few items on that Faucet</b>

> await faucet.mintItem(1, 10, "0x01");
> await faucet.mintItem(2, 20, "0x02");
> await faucet.mintItem(3, 30, "0x03");

<b>Create Tranche</b>

> await faucet.createTranche(1, [1, 2, 3], "0x01", true, {from: "0x70FD938dE9199F4650c7a97B2Ebb1AF98B4733C9"});

<b>Set User Tranche Level</b>

> await faucet.setUserTrancheLevel(1, "0x9C0790Eb0F96B16Ea1806e20B0D0E21A31DC93BC", {from: "0x70FD938dE9199F4650c7a97B2Ebb1AF98B4733C9"});

<b>Get Fuse Pool Adapter Contract</b>

> const FusePoolAdapter = await ethers.getContractFactory("FusePoolAdapter");

<b>Attach Deployed Faucet Instance</b>

> const fusePoolAdapter = await FusePoolAdapter.attach("0xB158150d3544D6ff49993E6B77702B20eB13b34f");

<b>Set Fuse Pool Address</b>

> await fusePoolAdapter['setPoolAddress(address)']("0xa66FBe0D53Fb88d56c2F8dc735eB9D2DA1D87829", {from: "0x70FD938dE9199F4650c7a97B2Ebb1AF98B4733C9"});

## FUSE Log

Deploy: `yarn deploy --network fuse` and choose deploy

Upgrade: `yarn deploy --network fuse` and choose upgrade v2

#### Initial Deployments

Deploying a FusePoolAdapter on fuse | owner: 0x70FD938dE9199F4650c7a97B2Ebb1AF98B4733C9
Deployed at 0xa98c2f5b8cdd79AD4cAe7F3c131D6B8D58a1B576 on fuse! Trying to verify in 10 seconds!

Deploying a FaucetFactory on fuse | owner: 0x70FD938dE9199F4650c7a97B2Ebb1AF98B4733C9
Deployed at 0x745d8A62E8A4E5805fE0451F215D179f2a6a86aA on fuse! Trying to verify in 10 seconds!

Deploying a Faucet on fuse | owner: 0x70FD938dE9199F4650c7a97B2Ebb1AF98B4733C9
Deployed at 0x189f82BB5730b4D667f4957a8820777CC1fd8223 on fuse! Trying to verify in 10 seconds!

#### Deployment 2 with proper upgradeability

Deploying an upgradeable FusePoolAdapter on fuse | owner: 0x70FD938dE9199F4650c7a97B2Ebb1AF98B4733C9
Deployed at 0xB158150d3544D6ff49993E6B77702B20eB13b34f on fuse! Trying to verify in 10 seconds!

Deploying an upgradeable FaucetFactory on fuse | owner: 0x70FD938dE9199F4650c7a97B2Ebb1AF98B4733C9
Deployed at 0xe02745875f8F30d12E3cFd1B1B975ba96cFE4De1 on fuse! Trying to verify in 10 seconds!

Deploying a Faucet on fuse | owner: 0x70FD938dE9199F4650c7a97B2Ebb1AF98B4733C9
Deployed a Faucet at 0xFa219eCeD2B8ED3BA935aa5Ebc2eB59ed633d32B on fuse | owner: 0x70FD938dE9199F4650c7a97B2Ebb1AF98B4733C9

#### Upgraded Fuse Pool Adapter:

Upgradeing FusePoolAdapter on fuse to FusePoolAdapterV2 | owner: 0x70FD938dE9199F4650c7a97B2Ebb1AF98B4733C9
Successfully deployed FusePoolAdapterV2 at 0x77a8b49e8E02004c3D45768C932DdAed4B8d2AB4 on fuse | owner: 0x70FD938dE9199F4650c7a97B2Ebb1AF98B4733C9
