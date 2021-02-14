// contracts/TVL.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts-upgradeable/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155PausableUpgradeable.sol";

/// ---------------------------------------
/// @title An NFT for money market rewards
/// @author Andreas Bigger <bigger@usc.edu>
/// @dev ERC1155 NFTs with Chainlink Oracle
///      Access to allow pool creators to
///      distribute NFT rewards
/// ---------------------------------------
contract TVL is ERC1155PausableUpgradeable, OwnableUpgradeable {
    using SafeMathUpgradeable for uint256;

    // RariFundManager private ethPoolInstance;
    // address private ethPoolAddress = 0xD6e194aF3d9674b62D1b30Ec676030C23961275e;

    /// @dev load metadata api and fetch eth_pool balance
    function initialize(address _owner) public initializer {
        // ERC1155PausableUpgradeable("http://test.com");
        __Ownable_init();
        transferOwnership(_owner);
    }

    /// @dev function to mint items, only allowed for devs, external
    /// @param id token id
    /// @param amount: number of tokens
    /// @param data: name
    /// @return uint256
    function mint_item(
        uint256 id,
        uint256 amount,
        bytes calldata data
    ) external onlyOwner returns (uint256) {
        _mint(msg.sender, id, amount, data);
        return id;
    }
}
