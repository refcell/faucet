# erc1155

fungibility-agnostic and gas-efficient token contracts for gamifying TVL

### How it works

The TVL contract located in `./contracts/TVL.sol` is the base contract.

#### TVL Functions

### Contracts

Located in ./contracts

### Roadmap/TODO

- [x] Tranches
- [ ] Tranche Tests
- [ ] Uri substitutions
- [ ] Token Redemptions
- [ ] Emergency Pausing
- [ ] Liquidations

### Noted Issues

`SyntaxError: Cannot use import statement outside a module`
Specifically for `hardhat.config.ts`
fix is to change tsconfig.json module to commonjs from usually "es5" or "es6"
