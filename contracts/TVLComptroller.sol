// contracts/TVLComptroller.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/SafeERC20Upgradeable.sol";

/**
 * @title TVLComptroller
 * @author Andreas Bigger <bigger@usc.edu> (https://github.com/abigger87)
 * @notice TVLComptroller controls and mints TVL erc1155 tokens for pools
 */
contract TVLComptroller is Initializable, OwnableUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    /**
     * @dev Initializer that sets the address of the TVL.sol contract
     * @param _tvl_address The address for the TVL.sol contract
     */
    function initialize(address _tvl_address) public initializer {
        tvl_address = _tvl_address;
    }

    /**
     * @notice The address for the TVL.sol contract
     */
    address public tvl_address;

    /**
     * @dev Sets the address of the TVL.sol contract
     * @param _tvl_address The address for the TVL.sol contract
     */
    function setTVLAddress(address _tvl_address) external onlyOwner {
        tvl_address = _tvl_address;
    }

    /**
     * @dev Withdraws accrued fees on interest.
     * @param erc20Contract The ERC20 token address to withdraw. Set to the zero address to withdraw ETH.
     */
    function withdrawAssets(address erc20Contract) external {
        if (erc20Contract == address(0)) {
            uint256 balance = address(this).balance;
            require(balance >= 0, "No balance available to withdraw.");
            (bool success, ) = owner().call.value(balance)("");
            require(success, "Failed to transfer ETH balance to msg.sender.");
        } else {
            IERC20Upgradeable token = IERC20Upgradeable(erc20Contract);
            uint256 balance = token.balanceOf(address(this));
            require(balance >= 0, "No token balance available to withdraw.");
            token.safeTransfer(owner(), balance);
        }
    }

    /**
     * @dev Receives ETH fees.
     */
    receive() external payable {}
}
