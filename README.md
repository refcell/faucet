# Faucet

![Solidity Coverage](https://github.com/abigger87/Faucet/workflows/Coverage/badge.svg)
![Solidity Compiling](https://github.com/abigger87/Faucet/workflows/Compile/badge.svg)
![Solidity Linting](https://github.com/abigger87/Faucet/workflows/Lint/badge.svg)

SDK Package [faucet-sdk](https://github.com/abigger87/faucet-sdk) [![NPM](https://nodei.co/npm/faucet-sdk.png?compact=true)](https://npmjs.org/package/faucet-sdk)

Fungibility-agnostic and gas-efficient token contracts for gamifying TVL.

Built on top of OpenZeppelin's ERC 1155 Implementation.

### How it works

The Faucet contract located in `contracts/Faucet.sol` is the base contract.

This is a Faucet that manages how Pool TVL-based NFT tokens are distributed to pool members.

Faucet has an Adapter (interface: `contracts/interfaces/IAdapter.sol` and implemented in `contracts/adapters/`)
that specifies how to interact with various pools.
So, Faucet is easily extensible by creating an adapter to manage the interaction between Faucet.sol and your pool.

### Structure

<b>Base Contracts</b>: `contracts/`
<b>Adapters</b>: `contracts/adapters/`
<b>Interfaces</b>: `contracts/interfaces/`
<b>Various Abstract Parent Contracts</b>: `contracts/abstracts/`

<b>Tests</b>: `tests/`

<b>Hardhat Deployment</b>: `tasks.ts`

NOTE: Scripts and Migrations are redundand
<b>Migrations</b>: `migrations/`
<b>Scripts</b>: `scripts/`

### Major Roadmap/TODO

- [x] Basic Tranche Implementation
- [x] Basic Tranche Tests
- [ ] Uri substitutions
- [ ] Token Redemptions
  - Need to ensure tokens are transferred correctly
  - Still needs more tests
- [x] Emergency Pausing
  - Implemented with the Pausible functionality
- [ ] Liquidations
- [ ] Rug Pull Functionality

### Backlog

- [ ] Governing points
- [ ] Discord role points
- [ ] Private Pool Access
- [ ] Twitter shoutouts?

### Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

### License

[MIT](https://choosealicense.com/licenses/mit/)

### Noted Issues

`SyntaxError: Cannot use import statement outside a module`
Specifically for `hardhat.config.ts`
fix is to change tsconfig.json module to commonjs from usually "es5" or "es6"
