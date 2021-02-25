// contracts/TVL.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/math/SafeMathUpgradeable.sol";

/// ---------------------------------------
/// @title Abstract Adapter
/// @author Andreas Bigger <bigger@usc.edu>
/// ---------------------------------------
abstract contract Adapter is OwnableUpgradeable {
    using SafeMathUpgradeable for uint256;

    // * Array of approved admins
    address[] internal approvedAdmin;

    // * Default pool address
    address internal POOL_ADDRESS;

    modifier aboveZero(uint256 _x) {
        require(_x > 0, "Input must be greater than zero.");
        _;
    }

    modifier onlyAdmin(address _admin) {
        bool _is_approved = false;
        for (uint256 i = 0; i < approvedAdmin.length; i++) {
            if (approvedAdmin[i] == _admin) _is_approved = true;
        }
        require(
            _is_approved == true,
            "Function caller must be an adapter admin."
        );
        _;
    }

    modifier notAdmin(address _admin) {
        bool _is_admin = false;
        for (uint256 i = 0; i < approvedAdmin.length; i++) {
            if (approvedAdmin[i] == _admin) _is_admin = true;
        }
        require(
            _is_admin == false,
            "Function caller must not be an adapter admin."
        );
        _;
    }

    /// @dev load metadata api and fetch eth_pool balance
    /// @param _owner address of the contract owner
    /// @param _pool_address address of the pool
    function initialize(address _owner, address _pool_address)
        public
        virtual
        initializer
    {
        POOL_ADDRESS = _pool_address;
        approvedAdmin.push(_owner);
        __Ownable_init();
        transferOwnership(_owner);
    }

    /// @dev Allow owner to get the current pool address
    /// @return address of new pool
    function getPoolAddress()
        external
        view
        onlyAdmin(msg.sender)
        returns (address)
    {
        return POOL_ADDRESS;
    }

    /// @dev Allow owner to add address to admins
    /// @param _new_admin address of new admin
    /// @return address of new admin
    function addApprovedAdmin(address _new_admin)
        external
        notAdmin(_new_admin)
        onlyOwner
        returns (address)
    {
        require(_new_admin != address(0), "Must be a valid address");
        approvedAdmin.push(_new_admin);
        return _new_admin;
    }

    /// @dev Allow owner to remove address from admins
    /// @param _admin address of removed admin
    /// @return address of removed admin
    function removeApprovedAdmin(address _admin)
        external
        onlyAdmin(_admin)
        onlyOwner
        returns (address)
    {
        for (uint256 i = 0; i < approvedAdmin.length; i++) {
            if (approvedAdmin[i] == _admin) {
                delete approvedAdmin[i];
            }
        }
        return _admin;
    }

    /// @dev Allow owner to approve an admin
    /// @param _pool_address address of the pool
    /// @return address of new pool
    function setPoolAddress(address _pool_address)
        public
        virtual
        onlyAdmin(msg.sender)
        returns (address)
    {
        require(_pool_address != address(0), "Must be a valid address");
        POOL_ADDRESS = _pool_address;
        return _pool_address;
    }

    /// @dev Allow owner to approve an admin
    /// @param _from sender if internal
    /// @param _pool_address address of the pool
    /// @return address of new pool
    function setPoolAddress(address _from, address _pool_address)
        public
        onlyAdmin(msg.sender)
        onlyAdmin(_from)
        returns (address)
    {
        return setPoolAddress(_pool_address);
    }

    // TODO: IMPLEMENT IN CHILDREN
    /// @dev function to get the amount of pool share by a user
    /// @param _from address of the current user
    /// @param _max_amount the amount of a given token id
    /// @return uint256 amount of tokens to give to the user
    function getPoolShare(address _from, uint256 _max_amount)
        public
        virtual
        aboveZero(_max_amount)
        returns (uint256)
    {}

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
        uint256 _multiplied_numerator = _numerator.mul(10**(_precision.add(1)));
        // with rounding of last digit
        uint256 _quotient =
            ((_multiplied_numerator.div(_denominator)).add(5)).div(10);
        return (_quotient);
    }
}
