// contracts/TVL.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "../abstracts/Adapter.sol";
import "../interfaces/IFusePool.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// ---------------------------------------
/// @title Faucet adapter for Rari Fuse Pools
/// @author Andreas Bigger <bigger@usc.edu>
/// @dev ERC1155 NFTs to unlock rewards based on fuse pool TVL
/// ---------------------------------------
contract FusePoolAdapter is OwnableUpgradeable, Adapter, ReentrancyGuard {
    using SafeMathUpgradeable for uint256;

    // * Pool instance
    IFusePool private fusePool;

    address private FUSE_POOL_ADDRESS;

    /// @dev load metadata api and fetch eth_pool balance
    /// @param _owner address of the contract owner
    /// @param _pool_address address of the pool
    function initialize(address _owner, address _pool_address)
        public
        override
        initializer
    {
        FUSE_POOL_ADDRESS = _pool_address;
        fusePool = IFusePool(_pool_address);
        approvedAdmin.push(_owner);
        __Ownable_init();
        transferOwnership(_owner);
    }

    /// @dev Allow owner to set pool address to avoid unnecessary upgrades
    /// @param _pool_address address of the pool
    /// @return address of new pool
    function set_pool_address(address _pool_address)
        public
        override
        onlyAdmin(msg.sender)
        nonReentrant
        returns (address)
    {
        require(_pool_address != address(0), "Must be a valid address");
        FUSE_POOL_ADDRESS = _pool_address;
        fusePool = IFusePool(_pool_address);
        return _pool_address;
    }

    /// @dev function to get the amount of pool share by a user
    /// @param _from address of the current user
    /// @param _max_amount the amount of a given token id
    /// @return uint256 amount of tokens to give to the user
    function get_pool_share(address _from, uint256 _max_amount)
        public
        override
        aboveZero(_max_amount)
        returns (uint256)
    {
        uint256 fund_balance = fusePool.getEntireBalance();
        // * Check for divide-by-zero
        if (fund_balance == 0) return 0;
        uint256 user_balance = fusePool.balanceOf(_from);
        return _percent(user_balance, fund_balance, 2);
    }
}
