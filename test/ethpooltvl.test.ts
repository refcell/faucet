
const EthPoolTVL = artifacts.require("EthPoolTVL");
import { shouldThrow } from '../utils';
const addr_0 = '0x0000000000000000000000000000000000000000'
var chai = require('chai');
var BN = require('bn.js');
var bnChai = require('bn-chai');
chai.use(bnChai(BN));

let tvl;

contract("Deploy Eth Pool TVL NFT", (accounts) => {
  beforeEach(async () => {
    tvl = await EthPoolTVL.new({from: accounts[0]});
    await tvl.initialize(accounts[0], "https://test.com/{id}.png", '0xD6e194aF3d9674b62D1b30Ec676030C23961275e');
  });

  it("should set the right owner", async function () {
    let owner = await tvl.owner();
    expect(owner).to.equal(accounts[0]);
  });

  it("mints a new object with id 1", async function () {
    let res = await tvl.mint_item.call(1, 10, "0x1234", {from: accounts[0]});
    expect(res.toString()).to.equal('1');
  });

  it("should not be able to mint if not the owner", async () => {
    await shouldThrow(tvl.mint_item.call(1, 10, "0x1234", {from: accounts[1]}));
  });

});
