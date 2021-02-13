import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import chaiBnEqual from "chai-bn-equal";
chai.use(chaiBnEqual);
chai.use(chaiAsPromised);
chai.should();

import { artifacts, contract } from "hardhat";
import {
  TVLContract,
  TVLInstance
} from "../typechain";

const TVL: TVLContract = artifacts.require("TVL");

contract("TVL", () => {
  let tvl: TVLInstance;
  before(async () => {
    tvl = await TVL.new();
  });

  it("mints a new object with id 1", async function () {
    await tvl.mint_item(1, 10, "test").should.equal(1);
  });
});
