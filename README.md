# erc1155

fungibility-agnostic and gas-efficient token contracts for gamifying TVL

### How it works

The TVL contract located in `./contracts/TVL.sol` is the base contract.

#### TVL Functions

### Contracts

Located in ./contracts

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

### Noted Issues

`SyntaxError: Cannot use import statement outside a module`
Specifically for `hardhat.config.ts`
fix is to change tsconfig.json module to commonjs from usually "es5" or "es6"
