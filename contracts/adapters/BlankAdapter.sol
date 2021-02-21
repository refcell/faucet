// contracts/TVL.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "../abstracts/Adapter.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/math/SafeMathUpgradeable.sol";

/// ---------------------------------------
/// @title Empty Faucet Adapter
/// @author Andreas Bigger <bigger@usc.edu>
/// @dev ERC1155 NFTs to unlock rewards based on pool TVL
/// ---------------------------------------
contract BlankAdapter is OwnableUpgradeable, Adapter {
    using SafeMathUpgradeable for uint256;

    // * Overrides Adapter
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
        // TODO: Dynamically fetch fund_balance and user_balance
        uint256 fund_balance = 1000;
        uint256 user_balance = 0;
        uint256 percent = _percent(user_balance, fund_balance, 3);

        return _percent(_max_amount * percent, 1000, 2);
    }
}
