// contracts/TVL.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "./abstracts/TVL.sol";
import "./interfaces/IAdapter.sol";
import "./interfaces/IRariFundToken.sol";
import "./interfaces/IRariFundManager.sol";

/// ---------------------------------------
/// @title An NFT for Pool rewards
/// @author Andreas Bigger <bigger@usc.edu>
/// @notice Entry point for Faucet.
///         Has an Adapter with interfaced functions
///         to access standard pool attributes.
///         Custom adapters are defined in ./adapters/
/// @dev ERC1155 NFTs to unlock rewards based on pool TVL
///      is extendable using adapters.
/// ---------------------------------------
contract Faucet is TVL {
    using SafeMathUpgradeable for uint256;

    // * Pool Adapter
    IAdapter private adapterInstance;

    /// @dev load metadata api and fetch pool balance
    /// @param _owner address of the contract owner
    /// @param _uri base uri for initialization of erc1155
    /// @param _adapter_address address of the pool
    function initialize(
        address _owner,
        string memory _uri,
        address _adapter_address
    ) public override(TVL) initializer {
        ADAPTER_CONTRACT_ADDRESS = _adapter_address;
        adapterInstance = IAdapter(_adapter_address);
        __ERC1155_init(_uri);
        __Ownable_init();
        transferOwnership(_owner);
    }

    /// @dev Allow owner to get the current pool address
    /// @return address of new pool
    function getPoolAddress() external view returns (address) {
        return adapterInstance.getPoolAddress();
    }

    /// @dev Allow owner to set pool address to avoid unnecessary upgrades
    /// @dev Underlying Adapter handles permissions if msg.sender is allowed to call
    /// @param _pool_address address of the pool
    /// @return address of new pool
    function setPoolAddress(address _pool_address)
        external
        nonReentrant
        returns (address)
    {
        require(_pool_address != address(0), "Must be a valid address");
        return adapterInstance.setPoolAddress(msg.sender, _pool_address);
    }

    /// @dev Allow owner to get the current adapter address
    /// @return address of adapter
    function getAdapterAddress() external view returns (address) {
        return ADAPTER_CONTRACT_ADDRESS;
    }

    /// @dev Allow owner to set adapter address to avoid unnecessary upgrades
    /// @param _adapter_address address of the adapter
    /// @return address of new adapter
    function setAdapterAddress(address _adapter_address)
        external
        onlyOwner
        nonReentrant
        returns (address)
    {
        require(_adapter_address != address(0), "Must be a valid address");
        ADAPTER_CONTRACT_ADDRESS = _adapter_address;
        adapterInstance = IAdapter(_adapter_address);
        return _adapter_address;
    }

    /// @dev function to get the amount of pool share by a user
    /// @param _from address of the current user
    /// @param _max_amount the amount of a given token id
    /// @return uint256 amount of tokens to give to the user
    function getPoolShare(address _from, uint256 _max_amount)
        public
        override
        aboveZero(_max_amount)
        returns (uint256)
    {
        return adapterInstance.getPoolShare(_from, _max_amount);
    }
}
