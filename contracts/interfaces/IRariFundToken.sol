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
contract IRariFundToken {
    function totalSupply() public returns (uint256) {}

    function balanceOf(address _account) public returns (uint256) {}
}
