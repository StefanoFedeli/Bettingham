// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract GhamTreasury is Initializable, OwnableUpgradeable, UUPSUpgradeable {

    uint256 public lastWithdrawalTime;
    uint256 public monthlyLimit;

    // Events
    event FundsDeposited(address indexed sender, uint256 amount);
    event FundsWithdrawn(address indexed owner, uint256 amount);


    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address initialOwner) initializer public {
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
        lastWithdrawalTime = block.timestamp;
        monthlyLimit = 0;  // Will be calculated based on the current treasury balance
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}

    // Deposit function to add funds to the treasury
    function deposit() external payable onlyOwner {
        require(msg.value > 0);
        emit FundsDeposited(msg.sender, msg.value);
    }

    // Withdraw function with 1% monthly limit
    function withdraw(uint256 amount) external onlyOwner {
        require(block.timestamp >= lastWithdrawalTime + 30 days);
        
        uint256 currentBalance = address(this).balance;
        
        uint256 maxWithdrawableAmount = currentBalance / 100; // 1% of the current balance
        require(amount <= maxWithdrawableAmount);
        require(amount <= currentBalance);

        lastWithdrawalTime = block.timestamp;
        payable(owner()).transfer(amount);
        
        emit FundsWithdrawn(owner(), amount);
    }

    // Get current treasury balance
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Function to receive ETH
    receive() external payable {
        emit FundsDeposited(msg.sender, msg.value);
    }
}
