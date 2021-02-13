import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import chaiBnEqual from "chai-bn-equal";
chai.use(chaiBnEqual);
chai.use(chaiAsPromised);
chai.should();

import { contract } from "hardhat";
import { shouldThrow } from '../utils';

let tvl;

describe("Deploy_TVL", () => {
  beforeEach(async () => {
    const TVL = await ethers.getContractFactory("TVL");
    console.log("fetched contract");
    let tvl = await TVL.deploy();
    await tvl.deployed();
  });

  it("should set the right owner", async function () {
    // * This test expects the owner variable stored in the contract to be equal to our Signer's owner.
    expect(await tvl.owner()).to.equal("");
  });

  it("mints a new object with id 1", async function () {
    let res = await tvl.mint_item(1, 10, "0x1234");
    res.should.equal(1);
  });

  it("should not be able to mint if not the owner", async () => {
    await shouldThrow(tvl.mint_item(1, 10, "0x1234"));
  });

});
