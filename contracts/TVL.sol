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

    struct Tranche {
        uint256 level;
        uint256[] token_ids;
        uint256[] token_amounts;
        bool unlocked;
    }

    event TrancheCreated(
        address from,
        uint256 level,
        uint256[] token_id,
        uint256[] token_amounts,
        bool unlocked
    );

    event TrancheDeleted(address from, uint256 level);

    /// @dev private mapping to map an address to which tranche that address is on
    /// @dev stores user's tranche which is an availability of tokens
    mapping(address => uint256) private address_to_tranche;

    /// @dev maps if tranche level exists
    mapping(uint256 => bool) private tranche_exists;

    /// @dev private mapping to map a tranche level to a Tranche object
    /// @dev stores user's tranche which is an availability of tokens
    mapping(uint256 => Tranche) private tranche_map;

    event TrancheUpdate(
        address from,
        uint256 level,
        uint256 id,
        uint256 amount
    );

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
    ) internal override {
        // TODO: Check if user tranche level allows id and amounts to be transferred
        // TODO: Check if user is able to redeem that much amount as user % share of pool TVL
    }

    /// @dev function to create a tranche
    /// @param _level tranche level
    /// @param _token_ids: token ids
    /// @param _token_amounts: amounts of each token id
    /// @param _unlocked: whether tranche is enabled
    /// @return newly created tranche level
    function create_tranche(
        uint256 _level,
        uint256[] memory _token_ids,
        uint256[] memory _token_amounts,
        bool _unlocked
    ) external onlyOwner returns (uint256) {
        require(tranche_exists[_level] == false, "Tranche already exists!");

        // * Create new Tranche
        Tranche memory new_tranche =
            Tranche(_level, _token_ids, _token_amounts, _unlocked);
        tranche_map[_level] = new_tranche;

        // * EMIT Tranche Creation
        emit TrancheCreated(
            msg.sender,
            _level,
            _token_ids,
            _token_amounts,
            _unlocked
        );
        return _level;
    }

    /// @dev function to delete a tranche
    /// @param _level tranche level
    /// @return deleted tranche level
    function delete_tranche(uint256 _level)
        external
        onlyOwner
        returns (uint256)
    {
        require(tranche_exists[_level] == true, "Tranche must exist!");

        // * Delete Tranche
        delete tranche_map[_level];

        // * EMIT Tranche Deletion
        emit TrancheDeleted(msg.sender, _level);
        return _level;
    }
}
