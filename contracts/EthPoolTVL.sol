// contracts/TVL.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "./interfaces/IRariFundManager.sol";
import "./TVL.sol";

/// ---------------------------------------
/// @title An NFT for Rari Eth Pool rewards
/// @author Andreas Bigger <bigger@usc.edu>
/// @dev ERC1155 NFTs to unlock rewards based on eth pool TVL
/// ---------------------------------------
contract EthPoolTVL is TVL {
    using SafeMathUpgradeable for uint256;

    IRariFundManager private ethPoolInstance;
    address private ethPoolAddress = 0xD6e194aF3d9674b62D1b30Ec676030C23961275e;

    /// @dev load metadata api and fetch eth_pool balance
    function initialize(address _owner) public override(TVL) initializer {
        ethPoolInstance = IRariFundManager(ethPoolAddress);
        __Ownable_init();
        transferOwnership(_owner);
    }
}
