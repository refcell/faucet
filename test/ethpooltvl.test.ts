
const EthPoolTVL = artifacts.require("EthPoolTVL");
import { expect } from 'chai';
import { shouldThrow } from '../utils';
const addr_0 = '0x0000000000000000000000000000000000000000'
var chai = require('chai');
var BN = require('bn.js');
var bnChai = require('bn-chai');
chai.use(bnChai(BN));

let tvl;
const poolAddress = '0xD6e194aF3d9674b62D1b30Ec676030C23961275e';
const updatedPoolAddress = '0xC6BF8C8A55f77686720E0a88e2Fd1fEEF58ddf4a';
const standard_uri = "https://test.com/{id}.png";

contract("Deploy Eth Pool TVL NFT", (accounts) => {
  beforeEach(async () => {
    tvl = await EthPoolTVL.new({from: accounts[0]});
    await tvl.initialize(accounts[0], standard_uri, poolAddress);
  });

  // * ----------------------
  // *  EthPoolTVL.sol Tests
  // * ----------------------

  it("should set the right owner", async function () {
    let owner = await tvl.owner();
    expect(owner).to.equal(accounts[0]);
  });

  it("should be able to get the correct pool address", async () => {
    let fetched_pool_address = await tvl.get_pool_address.call({from: accounts[0]});
    expect(fetched_pool_address).to.equal(poolAddress);
  });

  it("should be able to set the correct pool address from the owner", async () => {
    let fetched_pool_address = await tvl.set_pool_address.call(updatedPoolAddress, {from: accounts[0]});
    expect(fetched_pool_address).to.equal(updatedPoolAddress);
  });

  it("should not be able to set pool address if not the owner", async () => {
    await shouldThrow(tvl.set_pool_address.call(updatedPoolAddress, {from: accounts[1]}));
  });

  // TODO: eth pool instance issue: "Error: Transaction reverted: function call to a non-contract account"
  xit("should be able to get user pool share", async () => {
    let share = await tvl.get_pool_share.call('0x9C0790Eb0F96B16Ea1806e20B0D0E21A31DC93BC', 1, {from: accounts[0]});
    expect(share.toString()).to.equal('0');
  });

  // * ---------------
  // *  TVL.sol Tests
  // * ---------------

  it("mints a new object with id 1", async function () {
    let res = await tvl.mint_item.call(1, 10, "0x1234", {from: accounts[0]});
    expect(res.toString()).to.equal('1');
  });

  it("should not be able to mint if not the owner", async () => {
    await shouldThrow(tvl.mint_item.call(1, 10, "0x1234", {from: accounts[1]}));
  });

  it("creates tranche from contract owner level 1", async function () {
    // * Mint 3 items
    await tvl.mint_item.call(1, 10, "0x1234", {from: accounts[0]});
    await tvl.mint_item.call(2, 10, "0x1234", {from: accounts[0]});
    await tvl.mint_item.call(3, 10, "0x1234", {from: accounts[0]});
    let res = await tvl.create_tranche.call(1, [1, 2, 3], standard_uri, true, {from: accounts[0]});
    expect(res.toString()).to.equal('1');
  });

  it("should not be able to create tranche if not the owner", async () => {
    await shouldThrow(tvl.create_tranche.call(1, [1, 2, 3], standard_uri, true, {from: accounts[1]}));
  });

  it("should be able to get if tranche exists", async () => {
    // * Mint token and create tranche
    await tvl.mint_item.call(1, 10, "0x1234", {from: accounts[0]});
    await tvl.create_tranche(1, [1], standard_uri, true, {from: accounts[0]});

    // * Fetch if tranche exists from owner
    let tranche_exists = await tvl.get_tranche_exists(1, {from: accounts[0]});
    expect(tranche_exists.toString()).to.equal('true');

    // * Fetch if tranche exists from user
    tranche_exists = await tvl.get_tranche_exists(1, {from: accounts[1]});
    expect(tranche_exists.toString()).to.equal('true');
  });

  it("should be able to get the correct tranche uri", async () => {
    // * Mint token and create tranche
    await tvl.mint_item.call(1, 10, "0x1234", {from: accounts[0]});
    await tvl.create_tranche(1, [1], standard_uri, true, {from: accounts[0]});

    // * Fetch standard uri for that tranche
    let fetched_uri = await tvl.get_tranche_uri(1, {from: accounts[0]});
    expect(fetched_uri).to.equal(standard_uri);
  });

  it("owner should be able to set tranche uri", async () => {
    // * Mint token and create tranche
    await tvl.mint_item.call(1, 10, "0x1234", {from: accounts[0]});
    await tvl.create_tranche(1, [1], standard_uri, true, {from: accounts[0]});

    // * Attempt to set tranche uri from owner account
    let tranche_level = await tvl.set_tranche_uri.call(1, standard_uri, {from: accounts[0]});
    expect(tranche_level.toString()).to.equal('1');
  });

  it("user should be able to set tranche uri", async () => {
    // * Mint token and create tranche
    await tvl.mint_item.call(1, 10, "0x1234", {from: accounts[0]});
    await tvl.create_tranche(1, [1], standard_uri, true, {from: accounts[0]});

    // * Attempt to set tranche uri from non-owner account
    await shouldThrow(tvl.set_tranche_uri.call(1, standard_uri, {from: accounts[1]}));
  });

});
