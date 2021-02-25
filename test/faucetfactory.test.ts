// * TS ignore "artifacts" since it is injected by hardhat config
//@ts-ignore
const Faucet = artifacts.require("Faucet");
//@ts-ignore
const BlankAdapter = artifacts.require("BlankAdapter");
//@ts-ignore
const FaucetFactory = artifacts.require("FaucetFactory");

import { expect } from 'chai';
var chai = require('chai');
var BN = require('bn.js');
var bnChai = require('bn-chai');
chai.use(bnChai(BN));

let faucet;
let faucetFactory;
let blankAdapter;

const rariPoolController = "0xa422890cbBE5EAa8f1c88590fBab7F319D7e24B6";
const standard_uri = "https://test.com/{id}.png";

// * TS ignore "contract" since it is injected by hardhat config
// @ts-ignore
contract("Deploy Faucet Factory", (accounts) => {
  beforeEach(async () => {
    blankAdapter = await BlankAdapter.new({from: accounts[0]});
    await blankAdapter.initialize(accounts[0], rariPoolController);
    let adapter_address = blankAdapter.address;
    faucetFactory = await FaucetFactory.new({from: accounts[0]});
    await faucetFactory.initialize(accounts[0]);
    let new_faucet_address = await faucetFactory.deployFaucet.call(accounts[0], standard_uri, adapter_address);
    await faucetFactory.deployFaucet(accounts[0], standard_uri, adapter_address);
    faucet = await Faucet.at(new_faucet_address);
    await blankAdapter.addApprovedAdmin(new_faucet_address, {from: accounts[0]});
  });

  // * ----------------------
  // *  FaucetFactory.sol Tests
  // * ----------------------

  it("should set the right Faucet Factory owner", async function () {
    let owner = await faucetFactory.owner();
    expect(owner).to.equal(accounts[0]);
  });

  it("should set the right Faucet owner", async function () {
    let owner = await faucet.owner();
    expect(owner).to.equal(accounts[0]);
  });

  it("should set the right Adapter owner", async function () {
    let owner = await blankAdapter.owner();
    expect(owner).to.equal(accounts[0]);
  });

  it("Faucet Factory should contain Faucet", async function () {
    let faucets = await faucetFactory.getFaucets.call();
    expect(faucets.toString()).to.equal(faucet.address.toString());
  });

  it("Faucet should be recorded as existing in Faucet Factory", async function () {
    let exists = await faucetFactory.faucetExists.call(faucet.address);
    expect(exists.toString()).to.equal('true');
  });

  it("Faucet should be mapped to owner", async function () {
    let my_faucets = await faucetFactory.getAccountFaucets.call(accounts[0]);
    expect(my_faucets.toString()).to.equal(faucet.address.toString());
  });

  it("Faucet Factory should be able to get faucets with data", async function () {
    let faucets = await faucetFactory.getFaucetsWithData.call();
    expect(faucets['0'][0]).to.equal(faucet.address.toString());
  });
});
