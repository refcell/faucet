// contracts/TVL.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "../abstracts/Adapter.sol";
import "../interfaces/IRariFundToken.sol";
import "../interfaces/IRariFundManager.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// ---------------------------------------
/// @title Faucet adapter for Rari Eth Pool
/// @author Andreas Bigger <bigger@usc.edu>
/// @dev ERC1155 NFTs to unlock rewards based on eth pool TVL
/// ---------------------------------------
contract EthPoolAdapter is OwnableUpgradeable, Adapter, ReentrancyGuard {
    using SafeMathUpgradeable for uint256;

    // * Pool instance
    IRariFundManager private ethPoolInstance;
    IRariFundToken private rftInstance;
    address private rftAddress = 0xCda4770d65B4211364Cb870aD6bE19E7Ef1D65f4;

    /// @dev load metadata api and fetch eth_pool balance
    /// @param _owner address of the contract owner
    /// @param _pool_address address of the pool
    function initialize(address _owner, address _pool_address)
        public
        override
        initializer
    {
        POOL_ADDRESS = _pool_address;
        ethPoolInstance = IRariFundManager(_pool_address);
        rftInstance = IRariFundToken(rftAddress);
        approvedAdmin.push(_owner);
        __Ownable_init();
        transferOwnership(_owner);
    }

    /// @dev Allow owner to set pool address to avoid unnecessary upgrades
    /// @param _pool_address address of the pool
    /// @return address of new pool
    function setPoolAddress(address _pool_address)
        public
        override
        onlyAdmin(msg.sender)
        nonReentrant
        returns (address)
    {
        require(_pool_address != address(0), "Must be a valid address");
        POOL_ADDRESS = _pool_address;
        ethPoolInstance = IRariFundManager(_pool_address);
        return _pool_address;
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
        uint256 fund_balance = ethPoolInstance.getEntireBalance();
        uint256 user_balance = _balanceOf(_from, fund_balance);
        uint256 percent = _percent(user_balance, fund_balance, 3);

        return _percent(_max_amount * percent, 1000, 2);
    }

    /// @dev Re-implemented Rari balanceOf function to prevent duplicate getFundBalance Calls
    /// @param _account user account
    /// @param _fundBalance fund balance
    /// @return uint256 user balance in pool
    function _balanceOf(address _account, uint256 _fundBalance)
        internal
        returns (uint256)
    {
        uint256 rftTotalSupply = rftInstance.totalSupply();
        if (rftTotalSupply == 0) return 0;
        uint256 rftBalance = rftInstance.balanceOf(_account);
        uint256 accountBalanceUSD =
            rftBalance.mul(_fundBalance).div(rftTotalSupply);
        return accountBalanceUSD;
    }
}
