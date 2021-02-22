// contracts/TrancheSystem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155PausableUpgradeable.sol";

abstract contract TrancheSystem is OwnableUpgradeable {
  using SafeMathUpgradeable for uint256;
  /// --------------------------------------------------------
  ///    Nominal Tranches - overridable with setTrancheLevels
  ///    Tranche 1 - user can mint 10 tokens of token id 1
  ///    Tranche 2 - mint 20 tokens of id 1, 10 of token id 2
  ///    Tranche 3 - mint 30 token 1, 20 token 2, 10 token 3
  ///    ...
  /// --------------------------------------------------------

  // /**
  //  * @dev Throws if called by any account other than the owner.
  //  */
  // modifier onlyOwner() {
  //     require(owner() == _msgSender(), "Ownable: caller is not the owner");
  //     _;
  // }

  modifier aboveZero(uint256 _x) {
    require(_x > 0, "Input must be greater than zero.");
    _;
  }

  modifier aboveZeroArray(uint256[] calldata _x) {
    for (uint256 i = 0; i < _x.length; i++) {
      require(_x[i] > 0, "Input must be greater than zero.");
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

  event SetUserTrancheEvent(address from, uint256 level, address user);

  event TokenRedemption(uint256[] ids, bytes data);

  /// @dev private mapping to map an address to which tranche that address is on
  /// @dev stores user's tranche which is an availability of tokens
  mapping(address => uint256) internal address_to_tranche;

  /// @dev maps if tranche level exists
  mapping(uint256 => bool) internal tranche_exists;

  /// @dev maps tranche to mapping of token ids to amounts
  mapping(uint256 => mapping(uint256 => uint256)) internal tranche_id_amounts;

  /// @dev internal mapping to map a tranche level to a Tranche object
  /// @dev stores user's tranche which is an availability of tokens
  mapping(uint256 => Tranche) internal tranche_map;

  /// @dev function to create a tranche
  /// @param _level tranche level
  /// @param _ids tranche token ids
  /// @param _tranche_uri tranche level uri
  /// @param _enabled whether tranche is enabled
  /// @return newly created tranche level
  function create_tranche(
    uint256 _level,
    uint256[] memory _ids,
    string memory _tranche_uri,
    bool _enabled
  ) external onlyOwner returns (uint256) {
    require(tranche_exists[_level] == false, "Tranche already exists!");

    // * Create new Tranche
    Tranche memory new_tranche = Tranche(_level, _ids, _tranche_uri, _enabled);
    tranche_map[_level] = new_tranche;

    // * Set tranche exists to true
    tranche_exists[_level] = true;

    // * Iterate over _ids and set amount to zero in mapping
    for (uint256 i = 0; i < _ids.length; i++) {
      tranche_id_amounts[_level][_ids[i]] = 0;
    }

    // * EMIT Tranche Creation
    emit TrancheCreated(msg.sender, _level, _ids, _tranche_uri, _enabled);

    return _level;
  }

  /// @dev function to check if tranche exists or not
  /// @param _level tranche level
  /// @return tranche uri for <_level> tranche
  function get_tranche_exists(uint256 _level)
    external
    view
    aboveZero(_level)
    returns (bool)
  {
    return tranche_exists[_level];
  }

  /// @dev function to get a tranche uri
  /// @param _level tranche level
  /// @return tranche uri for <_level> tranche
  function get_tranche_uri(uint256 _level)
    external
    view
    aboveZero(_level)
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
    aboveZero(_level)
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
    aboveZero(_level)
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
    aboveZero(_level)
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
    aboveZero(_level)
    aboveZero(_id)
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
    aboveZero(_level)
    aboveZero(_id)
    aboveZero(_amount)
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

  /// @dev gets tranche level _user is in
  /// @param _user address of user to be added
  /// @return tranche level
  function get_user_tranche_level(address _user)
    external
    view
    onlyOwner
    returns (uint256)
  {
    return address_to_tranche[_user];
  }

  /// @dev adds user to tranche
  /// @param _level tranche level
  /// @param _user address of user to be added
  /// @return tranche level
  function set_user_tranche_level(uint256 _level, address _user)
    external
    onlyOwner
    aboveZero(_level)
    trancheExists(_level)
    returns (uint256)
  {
    // * Set user to be in tranche
    address_to_tranche[_user] = _level;

    // * Emit SetUserTrancheEvent
    emit SetUserTrancheEvent(msg.sender, _level, _user);

    // * Returns tranche level user was added to
    return _level;
  }

  /// @dev function to delete a tranche
  /// @param _level tranche level
  /// @return deleted tranche level
  function delete_tranche(uint256 _level)
    external
    onlyOwner
    aboveZero(_level)
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
}
