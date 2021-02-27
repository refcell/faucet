// contracts/TVL.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "../abstracts/Adapter.sol";
import "../interfaces/compound/Comptroller.sol";
import "../interfaces/compound/CToken.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

/// ---------------------------------------
/// @title Faucet adapter for Rari Fuse Pools
/// @author Andreas Bigger <bigger@usc.edu>
/// @dev ERC1155 NFTs to unlock rewards based on fuse pool TVL
/// ---------------------------------------
contract FusePoolAdapter is
    OwnableUpgradeable,
    Adapter,
    ReentrancyGuardUpgradeable
{
    using SafeMathUpgradeable for uint256;

    // * Pool instance
    Comptroller private comptroller;

    /// @dev load metadata api and fetch eth_pool balance
    /// @param _owner address of the contract owner
    /// @param _pool_address address of the pool
    function initialize(address _owner, address _pool_address)
        public
        override
        initializer
    {
        POOL_ADDRESS = _pool_address;
        comptroller = Comptroller(_pool_address);
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
        comptroller = Comptroller(_pool_address);
        return _pool_address;
    }

    /**
     * @notice Returns total supply balance (in ETH)
     */
    function getPoolSummary() internal returns (uint256) {
        uint256 totalSupply = 0;
        CToken[] memory cTokens = comptroller.getAllMarkets();
        PriceOracle oracle = comptroller.oracle();

        for (uint256 i = 0; i < cTokens.length; i++) {
            CToken cToken = cTokens[i];
            (bool isListed, ) = comptroller.markets(address(cToken));
            if (!isListed) continue;
            uint256 assetTotalBorrow = cToken.totalBorrowsCurrent();
            uint256 assetTotalSupply =
                cToken.getCash().add(assetTotalBorrow).sub(
                    cToken.totalReserves()
                );
            uint256 underlyingPrice = oracle.getUnderlyingPrice(cToken);
            totalSupply = totalSupply.add(
                assetTotalSupply.mul(underlyingPrice).div(1e18)
            );
        }

        return totalSupply;
    }

    /// @dev Get total user's assets in comptroller
    /// @param _from address of user
    /// @return uint256: total user assets value
    function getAllUserAssets(address _from) internal view returns (uint256) {
        uint256 totalBalance = 0;
        CToken[] memory cTokens = comptroller.getAssetsIn(_from);
        for (uint256 i = 0; i < cTokens.length; i++) {
            CToken cToken = cTokens[i];
            totalBalance = totalBalance.add(cToken.balanceOf(_from));
        }
        return totalBalance;
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
        uint256 user_balance = getAllUserAssets(_from);
        uint256 market_balance = getPoolSummary();
        if (market_balance == 0) return 0;
        return _percent(user_balance, market_balance, 2);
    }
}
