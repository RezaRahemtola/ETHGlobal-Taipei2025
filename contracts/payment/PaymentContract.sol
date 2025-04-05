// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PaymentContract
 * @dev Contract to facilitate USDC transfers between users
 */
contract PaymentContract is Ownable {
    IERC20 public usdcToken;
    
    // Event emitted when a payment is completed
    event PaymentCompleted(
        address indexed sender,
        address indexed receiver,
        uint256 amount,
        uint256 timestamp
    );
    
    /**
     * @dev Contract constructor sets the USDC token address
     * @param _usdcTokenAddress The address of the USDC token contract
     */
    constructor(address _usdcTokenAddress) Ownable(msg.sender) {
        usdcToken = IERC20(_usdcTokenAddress);
    }
    
    /**
     * @dev Update the USDC token address if needed
     * @param _newUsdcTokenAddress The new address of the USDC token contract
     */
    function updateUsdcTokenAddress(address _newUsdcTokenAddress) external onlyOwner {
        usdcToken = IERC20(_newUsdcTokenAddress);
    }
    
    /**
     * @dev Send USDC from the sender to the receiver
     * @param _amount Amount of USDC to send
     * @param _receiver Address of the recipient
     * @return success Whether the transfer was successful
     */
    function sendPayment(uint256 _amount, address _receiver) external returns (bool success) {
        require(_amount > 0, "Amount must be greater than 0");
        require(_receiver != address(0), "Invalid receiver address");
        require(_receiver != msg.sender, "Cannot send to yourself");
        
        // Transfer tokens from sender to receiver
        // Note: Sender must approve this contract to spend their USDC first
        bool transferred = usdcToken.transferFrom(msg.sender, _receiver, _amount);
        require(transferred, "Transfer failed");
        
        // Emit the payment event
        emit PaymentCompleted(msg.sender, _receiver, _amount, block.timestamp);
        
        return true;
    }
}