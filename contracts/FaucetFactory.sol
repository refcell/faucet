// contracts/TVL.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "./Faucet.sol";
import "@openzeppelin/contracts-upgradeable/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/// ---------------------------------------
/// @title Faucet Factory
/// @author Andreas Bigger <bigger@usc.edu>
/// @notice A Factory for creating Faucets and tracking deployed ones
/// @dev Factory design pattern for deploying faucets
/// ---------------------------------------

contract FaucetFactory is OwnableUpgradeable {
    using SafeMathUpgradeable for uint256;

    /// @dev Array of deployed Faucets
    address[] public faucets;

    /// @dev Maps ethereum address to arrays of deployed faucet address
    mapping(address => address[]) private faucetsByAccount;

    /// @dev Maps Faucet addresses to bools if they have been stored here.
    mapping(address => bool) public faucetExists;

    /// @dev Emitted when a new Faucet is added to the factory.
    event FaucetRegistered(uint256 index, address faucet);

    /// @dev Emitted when a new Faucet is deployed.
    event FaucetDeployed(address owner, address faucet);

    /// @dev Initialize OwnableUpgradeable
    /// @param _owner address of the contract owner
    function initialize(address _owner) public virtual initializer {
        __Ownable_init();
        transferOwnership(_owner);
    }

    /// @dev Deploys a new Faucet contract and Registers here
    /// @param _owner the owner of the new faucet
    /// @param _uri base uri for initialization of erc1155
    /// @param _adapter_address address of the pool
    /// @return address of the new Faucet
    function deployFaucet(
        address _owner,
        string memory _uri,
        address _adapter_address
    ) external returns (address) {
        Faucet _newFaucet = new Faucet();
        _newFaucet.initialize(_owner, _uri, _adapter_address);
        address _faucetAddress = address(_newFaucet);
        emit FaucetDeployed(_owner, _faucetAddress);
        _registerFaucet(_faucetAddress, _owner);
        return _faucetAddress;
    }

    /// @dev Adds a Faucet to our directory.
    /// @param _address The address of the faucet
    /// @param _owner The owner of the faucet
    /// @return The index of the registered Faucet
    function _registerFaucet(address _address, address _owner)
        internal
        returns (uint256)
    {
        require(
            !faucetExists[_address],
            "Faucet already exists in the directory."
        );
        faucets.push(_address);
        faucetsByAccount[_owner].push(_address);
        faucetExists[_address] = true;
        emit FaucetRegistered(faucets.length - 1, _address);
        return faucets.length - 1;
    }

    /// @notice Returns arrays of all Faucets
    /// @return address[]
    function getFaucets() external view returns (address[] memory) {
        return faucets;
    }

    /// @notice Gets faucets for a given account
    /// @param _from address for which we return faucets
    /// @return address
    function getAccountFaucets(address _from)
        external
        view
        returns (address[] memory)
    {
        return faucetsByAccount[_from];
    }

    /// @notice Returns arrays of all Faucets flush with tranche data
    /// @dev This function is not designed to be called in a transaction: it is too gas-intensive.
    function getFaucetsWithData()
        external
        view
        returns (
            address[] memory,
            uint256[] memory,
            uint256[] memory
        )
    {
        uint256[] memory maxTokenIds = new uint256[](faucets.length);
        uint256[] memory totalNumTokens = new uint256[](faucets.length);
        for (uint256 i = 0; i < faucets.length; i++) {
            // * Get the hightest tranche level
            uint256 totalTokenNum = Faucet(faucets[i]).getTotalNumberTokens();
            maxTokenIds[i] = Faucet(faucets[i]).maxTokenId();
            totalNumTokens[i] = totalTokenNum;
        }

        return (faucets, totalNumTokens, maxTokenIds);
    }
}
