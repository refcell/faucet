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
abstract contract TVL is ERC1155PausableUpgradeable, OwnableUpgradeable {
    using SafeMathUpgradeable for uint256;

    /// --------------------------------------------------------
    ///    Nominal Tranches - overridable with setTrancheLevels
    ///    Tranche 1 - user can mint 10 tokens of token id 1
    ///    Tranche 2 - mint 20 tokens of id 1, 10 of token id 2
    ///    Tranche 3 - mint 30 token 1, 20 token 2, 10 token 3
    ///    ...
    /// --------------------------------------------------------

    /// @dev private mapping to map an address to which tranche that address is on
    /// @dev stores user's tranche which is an availability of tokens
    mapping(address => uint256) private tranche_map;

    /// @dev load metadata api and instantiate ownership
    function initialize(address _owner, string memory uri)
        public
        virtual
        initializer
    {
        __ERC1155_init(uri);
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

    /// @dev overriden function from ERC1155Upgradeable.sol to regulate token transfers
    /// @param operator token id
    /// @param from address transferring
    /// @param to receiving address
    /// @param ids token ids to transfer
    /// @param amounts amounts of each token id to transfer
    /// @param data token id data
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override {}
}
