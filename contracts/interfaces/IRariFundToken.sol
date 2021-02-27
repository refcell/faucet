// contracts/interfaces/IRariFundManager.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

// import "@openzeppelin/contracts/proxy/Initializable.sol";
// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";

/// ---------------------------------------
/// @title RariFundToken Interface
/// @notice simple interface for existing
///         RariFundToken contract
/// ---------------------------------------
interface IRariFundToken {
    function totalSupply() external returns (uint256);

    function balanceOf(address _account) external returns (uint256);
}
