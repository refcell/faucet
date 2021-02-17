// contracts/TVL.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "./TVL.sol";
import "./interfaces/IRariFundToken.sol";
import "./interfaces/IRariFundManager.sol";

/// ---------------------------------------
/// @title An NFT for Rari Eth Pool rewards
/// @author Andreas Bigger <bigger@usc.edu>
/// @dev ERC1155 NFTs to unlock rewards based on eth pool TVL
/// ---------------------------------------
contract EthPoolTVL is TVL {
    using SafeMathUpgradeable for uint256;

    // * Pool instance
    IRariFundManager private ethPoolInstance;
    IRariFundToken private rftInstance;

    address private rftAddress = 0xCda4770d65B4211364Cb870aD6bE19E7Ef1D65f4;

    /// @dev load metadata api and fetch eth_pool balance
    /// @param _owner address of the contract owner
    /// @param _uri base uri for initialization of erc1155
    /// @param _pool_address address of the pool
    function initialize(
        address _owner,
        string memory _uri,
        address _pool_address
    ) public override(TVL) initializer {
        poolAddress = _pool_address;
        ethPoolInstance = IRariFundManager(_pool_address);
        rftInstance = IRariFundToken(rftAddress);
        __ERC1155_init(_uri);
        __Ownable_init();
        transferOwnership(_owner);
    }

    /// @dev Allow owner to get the current pool address
    /// @return address of new pool
    function get_pool_address() external view onlyOwner returns (address) {
        return poolAddress;
    }

    /// @dev Allow owner to set pool address to avoid unnecessary upgrades
    /// @param _pool_address address of the pool
    /// @return address of new pool
    function set_pool_address(address _pool_address)
        external
        onlyOwner
        returns (address)
    {
        require(_pool_address != address(0), "Must be a valid address");
        poolAddress = _pool_address;
        ethPoolInstance = IRariFundManager(_pool_address);
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
        uint256 fund_balance = ethPoolInstance.getFundBalance();
        uint256 user_balance = ethPoolInstance._balanceOf(_from);
        uint256 percent = _percent(user_balance, fund_balance, 3);

        return _percent(_max_amount * percent, 1000, 2);
    }

    /// @dev helper function to get percent
    /// @param _numerator fraction numerator
    /// @param _denominator fraction denominator
    /// @param _precision precision of numerator in calculation
    /// @return uint256 percent * 10
    function _percent(
        uint256 _numerator,
        uint256 _denominator,
        uint256 _precision
    ) internal pure returns (uint256) {
        // caution, check safe-to-multiply here
        uint256 _multiplied_numerator = _numerator * 10**(_precision + 1);
        // with rounding of last digit
        uint256 _quotient = ((_multiplied_numerator / _denominator) + 5) / 10;
        return (_quotient);
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
