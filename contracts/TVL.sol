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

    modifier aboveOrEqualZero(uint256 _x) {
        require(_x >= 0, "Input must be greater than or equal to zero.");
        _;
    }

    modifier aboveOrEqualZeroArray(uint256[] calldata _x) {
        for (uint256 i = 0; i < _x.length; i++) {
            require(_x[i] >= 0, "Input must be greater than or equal to zero.");
        }
        _;
    }

    modifier trancheExists(uint256 _level) {
        require(tranche_exists[_level] == true, "Tranche must exist!");
        _;
    }

    struct Tranche {
        uint256 level;
        uint256[] ids;
        string uri;
        bool enabled;
    }

    event TrancheCreated(
        address from,
        uint256 level,
        uint256[] ids,
        string uri,
        bool enabled
    );

    event TrancheDeleted(address from, uint256 level);

    event TrancheUpdate(address from, uint256 level, string uri, bool enabled);

    event TrancheIdAmountUpdate(
        address from,
        uint256 level,
        uint256 id,
        uint256 amount
    );

    event TokenRedemption(uint256[] ids, bytes data);

    /// @dev private mapping to map an address to which tranche that address is on
    /// @dev stores user's tranche which is an availability of tokens
    mapping(address => uint256) private address_to_tranche;

    /// @dev maps if tranche level exists
    mapping(uint256 => bool) private tranche_exists;

    /// @dev maps tranche to mapping of token ids to amounts
    mapping(uint256 => mapping(uint256 => uint256)) private tranche_id_amounts;

    /// @dev private mapping to map a tranche level to a Tranche object
    /// @dev stores user's tranche which is an availability of tokens
    mapping(uint256 => Tranche) private tranche_map;

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
    /// @param _id token id
    /// @param _amount: number of tokens
    /// @param _uri_data: data to be injected into uri
    /// @return minted id
    function mint_item(
        uint256 _id,
        uint256 _amount,
        bytes calldata _uri_data
    ) external onlyOwner aboveOrEqualZero(_id) returns (uint256) {
        _mint(msg.sender, _id, _amount, _uri_data);
        return _id;
    }

    /// @dev overriden function from ERC1155Upgradeable.sol to regulate token transfers
    /// @param operator token id
    /// @param from address transferring
    /// @param to receiving address
    /// @param data token id data
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override {
        // * Get current user tranche level
        uint256 user_level = address_to_tranche[from];

        // * Get current user tranche from level
        Tranche memory user_tranche = tranche_map[user_level];

        // * Get which ids are available to user
        uint256[] memory user_ids = user_tranche.ids;

        for (uint256 id = 0; id < user_ids.length; id++) {
            uint256 max_amount = tranche_id_amounts[user_level][user_ids[id]];
            // * Calculate amount user can withdraw as % of pool TVL
            uint256 max_allowed = get_pool_share(max_amount);
            require(
                amounts[id] < max_allowed,
                "Id amounts must be less than the allowed tranche amounts."
            );
        }
    }

    /// @notice Must be implemented by children
    /// @dev function to get the amount of pool share the user has
    function get_pool_share(uint256 max_amount)
        public
        virtual
        returns (uint256);

    /// @dev function to create a tranche
    /// @param _level tranche level
    /// @param _ids tranche token ids
    /// @param _tranche_uri: tranche level uri
    /// @param _enabled: whether tranche is enabled
    /// @return newly created tranche level
    function create_tranche(
        uint256 _level,
        uint256[] memory _ids,
        string memory _tranche_uri,
        bool _enabled
    ) external onlyOwner returns (uint256) {
        require(tranche_exists[_level] == false, "Tranche already exists!");

        // * Create new Tranche
        Tranche memory new_tranche =
            Tranche(_level, _ids, _tranche_uri, _enabled);
        tranche_map[_level] = new_tranche;

        // * Iterate over _ids and set amount to zero in mapping
        for (uint256 i = 0; i < _ids.length; i++) {
            tranche_id_amounts[_level][_ids[i]] = 0;
        }

        // * Set tranche exists to true
        tranche_exists[_level] = true;

        // * EMIT Tranche Creation
        emit TrancheCreated(msg.sender, _level, _ids, _tranche_uri, _enabled);
        return _level;
    }

    /// @dev function to get a tranche uri
    /// @param _level tranche level
    /// @return tranche uri for <_level> tranche
    function get_tranche_uri(uint256 _level)
        external
        view
        aboveOrEqualZero(_level)
        trancheExists(_level)
        returns (string memory)
    {
        Tranche memory temp_tranche = tranche_map[_level];
        string memory return_uri = temp_tranche.uri;
        return return_uri;
    }

    /// @dev function to get a tranche uri
    /// @param _level tranche level
    /// @param _uri tranche uri
    /// @return tranche level
    function set_tranche_uri(uint256 _level, string memory _uri)
        external
        onlyOwner
        aboveOrEqualZero(_level)
        trancheExists(_level)
        returns (uint256)
    {
        tranche_map[_level].uri = _uri;
        return _level;
    }

    /// @dev function to get if tranche is enabled
    /// @param _level tranche level
    /// @return if tranche <_level> is enabled
    function get_tranche_enabled(uint256 _level)
        external
        view
        aboveOrEqualZero(_level)
        trancheExists(_level)
        returns (bool)
    {
        Tranche memory temp_tranche = tranche_map[_level];
        bool tranche_rnabled = temp_tranche.enabled;
        return tranche_rnabled;
    }

    /// @dev sets tranche enabled
    /// @param _level tranche level
    /// @param _enabled whether tranche is enabled or not
    /// @return tranche level
    function set_tranche_enabled(uint256 _level, bool _enabled)
        external
        onlyOwner
        aboveOrEqualZero(_level)
        trancheExists(_level)
        returns (uint256)
    {
        // * Set if tranche is enabled or not
        Tranche memory updated_tranche = tranche_map[_level];
        updated_tranche.enabled = _enabled;
        tranche_map[_level] = updated_tranche;
        emit TrancheUpdate(msg.sender, _level, updated_tranche.uri, _enabled);

        return _level;
    }

    /// @dev function to get amount of ids in a given <_level> tranche
    /// @param _level tranche level
    /// @param _id token id
    /// @return uint256 amount of token ids in the tranche
    function get_tranche_id_amounts(uint256 _level, uint256 _id)
        external
        view
        aboveOrEqualZero(_level)
        aboveOrEqualZero(_id)
        trancheExists(_level)
        returns (uint256)
    {
        uint256 _id_amounts = tranche_id_amounts[_level][_id];
        return _id_amounts;
    }

    /// @dev sets tranche id amounts
    /// @param _level tranche level
    /// @param _id token id
    /// @param _amount token id amount
    /// @return tranche level
    function set_tranche_id_amounts(
        uint256 _level,
        uint256 _id,
        uint256 _amount
    )
        external
        onlyOwner
        aboveOrEqualZero(_level)
        aboveOrEqualZero(_id)
        aboveOrEqualZero(_amount)
        trancheExists(_level)
        returns (uint256)
    {
        // * Iterate over Tranche struct ids, if not present we need to add
        bool contained = false;
        for (uint256 i = 0; i < tranche_map[_level].ids.length; i++) {
            if (tranche_map[_level].ids[i] == _id) contained = true;
        }
        if (!contained) tranche_map[_level].ids.push(_id);

        // * Set amount of id tokens in tranche
        tranche_id_amounts[_level][_id] = _amount;
        emit TrancheIdAmountUpdate(msg.sender, _level, _id, _amount);

        // * Returns tranche level of updated
        return _level;
    }

    /// @dev function to delete a tranche
    /// @param _level tranche level
    /// @return deleted tranche level
    function delete_tranche(uint256 _level)
        external
        onlyOwner
        aboveOrEqualZero(_level)
        trancheExists(_level)
        returns (uint256)
    {
        // * Deletes every id from tranche_id_amounts mapping
        for (uint256 i = 0; i < tranche_map[_level].ids.length; i++) {
            uint256 temp_id = tranche_map[_level].ids[i];
            delete tranche_id_amounts[_level][temp_id];
        }

        // * Delete Tranche
        delete tranche_map[_level];

        // * Set tranche exists to false
        tranche_exists[_level] = false;

        // * EMIT Tranche Deletion
        emit TrancheDeleted(msg.sender, _level);
        return _level;
    }

    /// @dev function to redeem tokens
    /// @param _ids tranche level
    /// @param _data data for batch transfer
    /// @return bool if successful
    function redeem(uint256[] calldata _ids, bytes calldata _data)
        external
        aboveOrEqualZeroArray(_ids)
        whenNotPaused()
        returns (bool)
    {
        bool successful = true;

        // * Get current user tranche level
        uint256 user_level = address_to_tranche[msg.sender];

        // * Get current user tranche from level
        Tranche memory user_tranche = tranche_map[user_level];

        // * Get which ids are available to user
        uint256[] memory user_ids = user_tranche.ids;

        // * Batch transfer array
        uint256[] memory batch_ids;
        uint256[] memory batch_amounts;

        uint256 counter = 0;
        // * Iterate over tranche ids and redeem the ones in the input array
        for (uint256 i = 0; i < user_ids.length; i++) {
            uint256 user_id = user_ids[i];
            for (uint256 x = 0; x < _ids.length; x++) {
                if (user_id == _ids[x]) {
                    // * If this is an id to redeem, append to amounts for batch transfer
                    batch_ids[counter] = user_id;
                    batch_amounts[counter] = tranche_id_amounts[user_level][
                        user_id
                    ];
                    counter++;
                }
            }
        }

        // * Batch transfer
        safeBatchTransferFrom(
            address(this),
            msg.sender,
            batch_ids,
            batch_amounts,
            _data
        );

        // * Emit redemption event
        emit TokenRedemption(batch_ids, _data);

        // * Returns if successful
        return successful;
    }
}
