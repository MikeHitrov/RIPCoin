// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RipCoinNFT.sol";

contract RIPCoin is ERC20, Ownable(msg.sender) {
    uint256 public constant MAX_TAX_PERCENTAGE = 10; // Maximum tax limit
    address public taxWallet; // Wallet to collect tax
    RIPCoinNFT private nftContract; // NFT contract instance

    struct TaxConfig {
        uint256 baseTaxPercentage;
        bool isDynamic; // Whether the tax is dynamic based on certain conditions
    }

    TaxConfig public taxConfig;
    mapping(address => bool) private excludedFromTax; // Addresses exempted from tax
    mapping(address => uint256) public userRewards; // Track rewards for users

    // Constructor to initialize token and tax wallet
    constructor(
        address _taxWallet,
        address _nftContract
    ) ERC20("RIPCoin", "RIP") {
        require(_taxWallet != address(0), "Invalid tax wallet address");
        taxWallet = _taxWallet;
        nftContract = RIPCoinNFT(_nftContract);
        taxConfig = TaxConfig(5, false); // Default tax: 5%
        _mint(msg.sender, 1000000 * 10 ** decimals()); // Mint initial supply
    }

    // Override the transfer function to handle tax and NFT minting
    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal override {
        uint256 taxAmount = 0;

        // Apply tax if the sender or recipient is not excluded
        if (!excludedFromTax[sender] && !excludedFromTax[recipient]) {
            taxAmount = calculateTax(amount);
            super._transfer(sender, taxWallet, taxAmount); // Transfer tax to tax wallet
        }

        super._transfer(sender, recipient, amount - taxAmount);

        // Mint NFT if recipient has not minted before
        if (!nftContract.hasMinted(recipient)) {
            nftContract.mint(recipient); // Mint NFT to the recipient
        }

        // Optional: Reward the sender based on transaction volume
        userRewards[sender] += amount / 100; // Simple reward logic
    }

    // Function to calculate tax based on conditions
    function calculateTax(uint256 amount) internal view returns (uint256) {
        if (taxConfig.isDynamic) {
            // Implement dynamic tax calculation logic here if needed
            return (amount * taxConfig.baseTaxPercentage) / 100; // Placeholder
        }
        return (amount * taxConfig.baseTaxPercentage) / 100;
    }

    // Admin functions
    function changeTaxWallet(address _newTaxWallet) external onlyOwner {
        require(_newTaxWallet != address(0), "Invalid address");
        taxWallet = _newTaxWallet;
    }

    function setTaxPercentage(uint256 _taxPercentage) external onlyOwner {
        require(_taxPercentage <= MAX_TAX_PERCENTAGE, "Tax too high"); // Limit max tax to 10%
        taxConfig.baseTaxPercentage = _taxPercentage;
    }

    function setDynamicTax(bool _isDynamic) external onlyOwner {
        taxConfig.isDynamic = _isDynamic; // Enable or disable dynamic tax
    }

    function excludeFromTax(address _account, bool _status) external onlyOwner {
        excludedFromTax[_account] = _status;
    }

    // Function to burn tokens
    function burn(uint256 amount) external {
        _burn(msg.sender, amount); // Burn tokens from sender
        // Optionally mint an NFT when burning tokens
        nftContract.mint(msg.sender);
    }
}
