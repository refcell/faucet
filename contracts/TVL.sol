// contracts/TVL.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts-upgradeable/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

/// ---------------------------------------
/// @title An NFT for money market rewards
/// @author Andreas Bigger <bigger@usc.edu>
/// @dev ERC1155 NFTs with Chainlink Oracle
///      Access to allow pool creators to
///      distribute NFT rewards
/// ---------------------------------------
contract TVL is ERC1155 {
    using SafeMathUpgradeable for uint256;

    // -------------------------------------
    // TODO: Add Chainlink Oracle Logic Here
    // -------------------------------------

    /// @dev hollow constructor with metadata api
    constructor() public ERC1155("https://game.example/api/item/{id}.json") {}

    /// @dev function to mint items, only allowed for devs, external
    /// @param uint256
    /// @param uint256
    /// @param butes
    /// @return uint256
    function mint_item(
        uint256 id,
        uint256 amount,
        bytes data
    ) external onlyOwner returns (uint256) {
        _mint(msg.sender, id, amount, data);
        return id;
    }
}
