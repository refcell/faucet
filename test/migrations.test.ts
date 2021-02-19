
const Migrations = artifacts.require("Migrations");
import { expect } from 'chai';
var chai = require('chai');
var BN = require('bn.js');
var bnChai = require('bn-chai');
chai.use(bnChai(BN));

let migrations;

contract("Deploy Migrations", (accounts) => {
    // * ----------------------
    // * Migrations.sol Tests
    // * ----------------------

    beforeEach(async () => {
        migrations = await Migrations.new({from: accounts[0]});
    });

    it("should be deployed from the right owner", async function () {
        let owner = await migrations.owner();
        expect(owner).to.equal(accounts[0]);
    });

    it("should set the correct last completed migration", async () => {
        await migrations.setCompleted(1, {from: accounts[0]});
        let completed_val = await migrations.last_completed_migration();
        expect(completed_val.toString()).to.equal('1');
    });

    it("should upgrade correctly", async () => {
        // * Deploy new Migrations from accounts[1]
        let new_migrations = await Migrations.new({from: accounts[1]});
        let new_migrations_address = new_migrations.address;

        // * Upgrade old migrations to this new address
        await migrations.upgrade(new_migrations_address, {from: accounts[0]});

        // * Test to make sure last_completed_migration are equal
        let completed_val = await migrations.last_completed_migration();
        let completed_val_new = await new_migrations.last_completed_migration();
        expect(completed_val.toString()).to.equal(completed_val_new.toString());
    });

});
