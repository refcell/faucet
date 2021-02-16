// contracts/interfaces/IRariFundManager.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

/// ---------------------------------------
/// @title RariFundManager Interface
/// @notice simple interface for existing
///         RariFundManager contract
/// ---------------------------------------
contract IRariFundManager {
    /**
     * @notice Returns the fund's total investor balance (all REPT holders' funds but not unclaimed fees) of all currencies in EETH (scaled by 1e18).
     * @dev Ideally, we can add the view modifier, but Compound's `getUnderlyingBalance` function (called by `getRawFundBalance`) potentially modifies the state.
     */
    function getFundBalance() public returns (uint256) {}

    /**
     * @notice Returns an account's total balance in ETH.
     * @dev Ideally, we can add the view modifier, but Compound's `getUnderlyingBalance` function (called by `getRawFundBalance`) potentially modifies the state.
     * @param account The account whose balance we are calculating.
     */
    function balanceOf(address account) external returns (uint256) {}
}
