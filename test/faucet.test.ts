// * TS ignore "artifacts" since it is injected by hardhat config
//@ts-ignore
const Faucet = artifacts.require("Faucet");
//@ts-ignore
const BlankAdapter = artifacts.require("BlankAdapter");

import { expect } from 'chai';
import { ShouldThrow } from '../utils';
var chai = require('chai');
var BN = require('bn.js');
var bnChai = require('bn-chai');
chai.use(bnChai(BN));

let faucet;
let blankAdapter;

const rariPoolController = "0xa422890cbBE5EAa8f1c88590fBab7F319D7e24B6";
const poolAddress = '0xD6e194aF3d9674b62D1b30Ec676030C23961275e';
const updatedPoolAddress = '0xC6BF8C8A55f77686720E0a88e2Fd1fEEF58ddf4a';
const user_address = '0x9C0790Eb0F96B16Ea1806e20B0D0E21A31DC93BC';

const standard_uri = "https://test.com/{id}.png";

// * TS ignore "contract" since it is injected by hardhat config
// @ts-ignore
contract("Deploy Blank Faucet", (accounts) => {
  beforeEach(async () => {
    blankAdapter = await BlankAdapter.new({from: accounts[0]});
    await blankAdapter.initialize(accounts[0], rariPoolController);
    let adapter_address = blankAdapter.address;
    faucet = await Faucet.new({from: accounts[0]});
    await faucet.initialize(accounts[0], standard_uri, adapter_address);
    await blankAdapter.addApprovedAdmin(faucet.address, {from: accounts[0]});
  });

  // * ----------------------
  // *  EthPoolTVL.sol Tests
  // * ----------------------

  it("should set the right owner", async function () {
    let owner = await faucet.owner();
    expect(owner).to.equal(accounts[0]);
  });

  it("should be able to get the correct pool address", async () => {
    let fetched_pool_address = await faucet.getPoolAddress.call({from: accounts[0]});
    expect(fetched_pool_address).to.equal(rariPoolController);
  });

  it("should be able to set the correct pool address from the owner", async () => {
    let fetched_pool_address = await faucet.setPoolAddress.call(updatedPoolAddress, {from: accounts[0]});
    expect(fetched_pool_address).to.equal(updatedPoolAddress);
  });

  it("should not be able to set pool address if not the owner", async () => {
    await ShouldThrow(faucet.setPoolAddress.call(updatedPoolAddress, {from: accounts[1]}));
  });

  it("should be able to get user pool share", async () => {
    await faucet.setPoolAddress(rariPoolController, {from: accounts[0]});
    let share = await faucet.getPoolShare.call(user_address, 1, {from: accounts[0]});
    expect(share.toString()).to.equal('0');
  });

  // * ---------------
  // *  TVL.sol Tests
  // * ---------------

  it("mints a new object with id 1", async function () {
    let res = await faucet.mintItem.call(1, 10, "0x1234", {from: accounts[0]});
    expect(res.toString()).to.equal('1');
  });

  it("should not be able to mint if not the owner", async () => {
    await ShouldThrow(faucet.mintItem.call(1, 10, "0x1234", {from: accounts[1]}));
  });

  it("creates tranche from contract owner level 1", async function () {
    // * Mint 3 items
    await faucet.mintItem(1, 10, "0x1234", {from: accounts[0]});
    await faucet.mintItem(2, 10, "0x1234", {from: accounts[0]});
    await faucet.mintItem(3, 10, "0x1234", {from: accounts[0]});
    let res = await faucet.createTranche.call(1, [1, 2, 3], standard_uri, true, {from: accounts[0]});
    expect(res.toString()).to.equal('1');
  });

  it("should not be able to create tranche if not the owner", async () => {
    await ShouldThrow(faucet.createTranche.call(1, [1, 2, 3], standard_uri, true, {from: accounts[1]}));
  });

  it("should be able to get if tranche exists", async () => {
    // * Mint token and create tranche
    await faucet.mintItem.call(1, 10, "0x1234", {from: accounts[0]});
    await faucet.createTranche(1, [1], standard_uri, true, {from: accounts[0]});

    // * Fetch if tranche exists from owner
    let tranche_exists = await faucet.getTrancheExists(1, {from: accounts[0]});
    expect(tranche_exists.toString()).to.equal('true');

    // * Fetch if tranche exists from user
    tranche_exists = await faucet.getTrancheExists(1, {from: accounts[1]});
    expect(tranche_exists.toString()).to.equal('true');
  });

  it("should be able to get the correct tranche uri", async () => {
    // * Mint token and create tranche
    await faucet.mintItem.call(1, 10, "0x1234", {from: accounts[0]});
    await faucet.createTranche(1, [1], standard_uri, true, {from: accounts[0]});

    // * Fetch standard uri for that tranche
    let fetched_uri = await faucet.getTrancheUri(1, {from: accounts[0]});
    expect(fetched_uri).to.equal(standard_uri);
  });

  it("owner should be able to set tranche uri", async () => {
    // * Expect uninitialized tranche get enabled to fail
    await ShouldThrow(faucet.setTrancheUri.call(1, standard_uri, {from: accounts[0]}));
    await ShouldThrow(faucet.setTrancheUri.call(1, standard_uri, {from: accounts[1]}));

    // * Mint token and create tranche
    await faucet.mintItem.call(1, 10, "0x1234", {from: accounts[0]});
    await faucet.createTranche(1, [1], standard_uri, true, {from: accounts[0]});

    // * Expect tranche with negative level to fail
    await ShouldThrow(faucet.setTrancheUri.call(-1, standard_uri, {from: accounts[0]}));
    await ShouldThrow(faucet.setTrancheUri.call(-1, standard_uri, {from: accounts[1]}));

    // * Attempt to set tranche uri from owner account
    let tranche_level = await faucet.setTrancheUri.call(1, standard_uri, {from: accounts[0]});
    expect(tranche_level.toString()).to.equal('1');
  });

  it("user should not be able to set tranche uri", async () => {
    // * Expect uninitialized tranche get enabled to fail
    await ShouldThrow(faucet.setTrancheUri.call(1, standard_uri, {from: accounts[0]}));
    await ShouldThrow(faucet.setTrancheUri.call(1, standard_uri, {from: accounts[1]}));

    // * Mint token and create tranche
    await faucet.mintItem.call(1, 10, "0x1234", {from: accounts[0]});
    await faucet.createTranche(1, [1], standard_uri, true, {from: accounts[0]});

    // * Expect tranche with negative level to fail
    await ShouldThrow(faucet.setTrancheUri.call(-1, standard_uri, {from: accounts[0]}));
    await ShouldThrow(faucet.setTrancheUri.call(-1, standard_uri, {from: accounts[1]}));

    // * Attempt to set tranche uri from non-owner account
    await ShouldThrow(faucet.setTrancheUri.call(1, standard_uri, {from: accounts[1]}));
  });

  it("should be able to get if the tranche is enabled", async () => {
    // * Expect uninitialized tranche get enabled to fail
    await ShouldThrow(faucet.getTrancheEnabled.call(1, {from: accounts[0]}));
    await ShouldThrow(faucet.getTrancheEnabled.call(1, {from: accounts[1]}));

    // * Mint token and create tranche
    await faucet.mintItem.call(1, 10, "0x1234", {from: accounts[0]});
    await faucet.createTranche(1, [1], standard_uri, true, {from: accounts[0]});

    // * Expect tranche with negative level to fail
    await ShouldThrow(faucet.getTrancheEnabled.call(-1, {from: accounts[0]}));
    await ShouldThrow(faucet.getTrancheEnabled.call(-1, {from: accounts[1]}));

    // * Check if tranche is enabled
    let enabled = await faucet.getTrancheEnabled(1, {from: accounts[0]});
    expect(enabled.toString()).to.equal('true');
    enabled = await faucet.getTrancheEnabled(1, {from: accounts[1]});
    expect(enabled.toString()).to.equal('true');
  });

  it("should be able to set tranche enabled", async () => {
    // * Expect uninitialized tranche get enabled to fail
    await ShouldThrow(faucet.setTrancheEnabled.call(1, true, {from: accounts[0]}));
    await ShouldThrow(faucet.setTrancheEnabled.call(1, true, {from: accounts[1]}));

    // * Mint token and create tranche
    await faucet.mintItem.call(1, 10, "0x1234", {from: accounts[0]});
    await faucet.createTranche(1, [1], standard_uri, true, {from: accounts[0]});

    // * Expect tranche with negative level to fail
    await ShouldThrow(faucet.setTrancheEnabled.call(-1, true, {from: accounts[0]}));
    await ShouldThrow(faucet.setTrancheEnabled.call(-1, true, {from: accounts[1]}));

    // * Set tranche enabled from owner
    let enabled = await faucet.setTrancheEnabled.call(1, true, {from: accounts[0]});
    expect(enabled.toString()).to.equal('1');

    // * Attempt to set tranche uri from non-owner account
    await ShouldThrow(faucet.setTrancheEnabled.call(1, true, {from: accounts[1]}));
  });

  it("should be able to get tranche id amounts", async () => {
    // * Expect uninitialized tranche get id amounts to fail
    await ShouldThrow(faucet.getTrancheIdAmounts.call(1, 1, {from: accounts[0]}));
    await ShouldThrow(faucet.getTrancheIdAmounts.call(1, 1, {from: accounts[1]}));

    // * Mint token and create tranche
    await faucet.mintItem.call(1, 10, "0x1234", {from: accounts[0]});
    await faucet.createTranche(1, [1], standard_uri, true, {from: accounts[0]});

    // * Expect tranche with negative level and id to fail
    await ShouldThrow(faucet.getTrancheIdAmounts.call(-1, 1, {from: accounts[0]}));
    await ShouldThrow(faucet.getTrancheIdAmounts.call(1, -1, {from: accounts[0]}));
    await ShouldThrow(faucet.getTrancheIdAmounts.call(-1, -1, {from: accounts[0]}));
    await ShouldThrow(faucet.getTrancheIdAmounts.call(-1, 1, {from: accounts[1]}));
    await ShouldThrow(faucet.getTrancheIdAmounts.call(1, -1, {from: accounts[1]}));
    await ShouldThrow(faucet.getTrancheIdAmounts.call(-1, -1, {from: accounts[1]}));

    // * Get tranche id amounts - initialized to 0
    let amounts = await faucet.getTrancheIdAmounts(1, 1, {from: accounts[0]});
    expect(amounts.toString()).to.equal('0');
    amounts = await faucet.getTrancheIdAmounts(1, 1, {from: accounts[1]});
    expect(amounts.toString()).to.equal('0');
  });

  it("should be able to set tranche id amounts", async () => {
    // * Expect uninitialized tranche set id amounts to fail
    await ShouldThrow(faucet.setTrancheIdAmounts.call(1, 1, 1, {from: accounts[0]}));
    await ShouldThrow(faucet.setTrancheIdAmounts.call(1, 1, 1, {from: accounts[1]}));

    // * Mint token and create tranche
    await faucet.mintItem.call(1, 10, "0x1234", {from: accounts[0]});
    await faucet.createTranche(1, [1], standard_uri, true, {from: accounts[0]});

    // * Expect tranche with negative level to fail
    await ShouldThrow(faucet.setTrancheIdAmounts.call(-1, 1, 1, {from: accounts[0]}));
    await ShouldThrow(faucet.setTrancheIdAmounts.call(1, -1, 1, {from: accounts[0]}));
    await ShouldThrow(faucet.setTrancheIdAmounts.call(1, 1, -1, {from: accounts[0]}));
    await ShouldThrow(faucet.setTrancheIdAmounts.call(-1, 1, 1, {from: accounts[1]}));
    await ShouldThrow(faucet.setTrancheIdAmounts.call(1, -1, 1, {from: accounts[1]}));
    await ShouldThrow(faucet.setTrancheIdAmounts.call(1, 1, -1, {from: accounts[1]}));

    // * Set tranche id amounts from owner
    let enabled = await faucet.setTrancheIdAmounts.call(1, 1, 1, {from: accounts[0]});
    expect(enabled.toString()).to.equal('1');

    // * Attempt to set tranche id amounts from non-owner account
    await ShouldThrow(faucet.setTrancheIdAmounts.call(1, 1, 1, {from: accounts[1]}));
  });

  it("should be able to delete a tranche", async () => {
    // * Expect uninitialized tranche deletion to fail
    await ShouldThrow(faucet.deleteTranche.call(1, {from: accounts[0]}));
    await ShouldThrow(faucet.deleteTranche.call(1, {from: accounts[1]}));

    // * Mint token and create tranche
    await faucet.mintItem.call(1, 10, "0x1234", {from: accounts[0]});
    await faucet.createTranche(1, [1], standard_uri, true, {from: accounts[0]});

    // * Expect tranche with negative level to fail
    await ShouldThrow(faucet.deleteTranche.call(-1, 1, 1, {from: accounts[0]}));
    await ShouldThrow(faucet.deleteTranche.call(1, -1, 1, {from: accounts[0]}));
    await ShouldThrow(faucet.deleteTranche.call(1, 1, -1, {from: accounts[0]}));
    await ShouldThrow(faucet.deleteTranche.call(-1, 1, 1, {from: accounts[1]}));
    await ShouldThrow(faucet.deleteTranche.call(1, -1, 1, {from: accounts[1]}));
    await ShouldThrow(faucet.deleteTranche.call(1, 1, -1, {from: accounts[1]}));

    // * Attempt to delete a tranche from non-owner account
    await ShouldThrow(faucet.deleteTranche.call(1, {from: accounts[1]}));

    // * Delete tranche from owner
    await faucet.deleteTranche(1, {from: accounts[0]});
    let exists = await faucet.getTrancheExists.call(1, {from: accounts[0]});
    expect(exists.toString()).to.equal('false');
  });

  it("should be able to redeem tokens", async () => {
    // * Pause contract tests
    await ShouldThrow(faucet.pause({ from: accounts[1] }));
    await faucet.pause({ from: accounts[0] });
    await ShouldThrow(faucet.pause({ from: accounts[0] }));

    // * Expect paused erc1155 to prevent redemption
    await ShouldThrow(faucet.redeem([1], "0x1234", {from: accounts[0]}));
    await ShouldThrow(faucet.redeem([1], "0x1234", {from: accounts[1]}));

    // * Unpause contract tests
    await ShouldThrow(faucet.unpause({ from: accounts[1] }));
    await faucet.unpause({ from: accounts[0] });
    await ShouldThrow(faucet.unpause({ from: accounts[0] }));

    // * Mint token and create tranche
    await faucet.mintItem(1, 10, "0x1234", {from: accounts[0]});
    await faucet.createTranche(1, [1], standard_uri, true, {from: accounts[0]});
    await faucet.setUserTrancheLevel(1, accounts[1], {from: accounts[0]});

    // * Expect negative ids to prevent redemption
    await ShouldThrow(faucet.redeem([-1], "0x1234", {from: accounts[0]}));
    await ShouldThrow(faucet.redeem([-1], "0x1234", {from: accounts[1]}));

    // * Expect successful redemption
    await faucet.setApproval(accounts[1], true, { from: accounts[0] });
    let successful = await faucet.redeem.call([1], "0x1234", {from: accounts[1]});
    expect(successful.toString()).to.equal('true');
  });

  it("should be able to get and set user tranche level", async () => {
    // * Mint token ids and create tranche
    await faucet.mintItem(1, 10, "0x1234", {from: accounts[0]});
    await faucet.createTranche(1, [1], standard_uri, true, {from: accounts[0]});

    // * Add user to tranche level
    await faucet.setUserTrancheLevel(1, accounts[1], {from: accounts[0]});
    await ShouldThrow(faucet.setUserTrancheLevel(-1, accounts[1], {from: accounts[0]}));

    // * Test that that user is actually in the level
    let user_tranche_level = await faucet.getUserTrancheLevel.call(accounts[1], { from: accounts[0] });
    expect(user_tranche_level.toString()).to.equal('1');
  });

  it("should be able to pause", async () => {
    // * Pause contract tests
    await ShouldThrow(faucet.pause({ from: accounts[1] }));
    await faucet.pause({ from: accounts[0] });
    await ShouldThrow(faucet.pause({ from: accounts[0] }));
  });

  it("should be able to pause", async () => {
    // * Unpause contract tests
    await faucet.pause({ from: accounts[0] });
    await ShouldThrow(faucet.unpause({ from: accounts[1] }));
    await faucet.unpause({ from: accounts[0] });
    await ShouldThrow(faucet.unpause({ from: accounts[0] }));
  });

});
