# **RIPCoin Token & NFT Minting Smart Contract**

Welcome to the **RIPCoin** repository! This project combines an ERC-20 token, `RIPCoin`, with an NFT minting mechanism. Each time a user buys or transfers `RIPCoin`, the smart contract automatically mints NFTs to their wallet if they don't already own them. The project is built with Solidity and uses OpenZeppelin for security and ease of development.

## **Table of Contents**
- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Setup & Deployment](#setup--deployment)
- [How It Works](#how-it-works)
- [Functions](#functions)
- [License](#license)

## **Overview**

`RIPCoin` is an ERC-20 token that comes with the following key features:
- **NFT Integration**: Automatically mints NFTs to users when they purchase or transfer `RIPCoin`.
- **Tax on Transactions**: A tax is applied to all transactions, and a portion of each transfer is sent to a specified tax wallet.
- **Customizable Tax and Wallets**: The tax percentage and tax wallet can be modified by the contract owner. Certain addresses can also be excluded from tax.
- **Uniswap Integration**: The token is paired with WETH on Uniswap V2, allowing decentralized trading and liquidity provision.

## **Features**

- **ERC-20 Token**: Standard token with minting, burning, and transfer functionalities.
- **ERC-721 NFT Minting**: Users automatically receive NFTs when buying `RIPCoin`. New NFTs can be added periodically.
- **Transaction Tax**: A tax (default 5%) is applied on every transaction, with proceeds going to a tax wallet.
- **Exclusion from Tax**: Certain wallets (e.g., deployer or partner wallets) can be excluded from transaction taxes.
- **Admin Control**: The deployer (or admin) has control over updating tax settings, adding new NFTs, and other parameters.

## **Technology Stack**

- **Solidity**: Smart contract language.
- **OpenZeppelin**: Secure ERC-20 and ERC-721 token contracts.
- **Uniswap V2**: Decentralized trading protocol.
- **Hardhat**: Development environment for Ethereum.
- **Ethers.js**: For interaction and deployment scripts.

## **Setup & Deployment**

### Prerequisites
Ensure that you have the following installed:
- **Node.js** (version 12+)
- **Hardhat** (for contract development)
- **Metamask** (for interaction and deployment)
- **Infura** or **Alchemy** (for Ethereum network access)

### Steps

1. **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/RIPCoin.git
    cd RIPCoin
    ```

2. **Install Dependencies**
    ```bash
    npm install
    ```

3. **Configure Environment Variables**
   Create a `.env` file to store sensitive data, such as your private keys and API keys.
    ```bash
    INFURA_API_KEY=<your_infura_api_key>
    PRIVATE_KEY=<your_deployer_wallet_private_key>
    ```

4. **Compile the Smart Contracts**
    ```bash
    npx hardhat compile
    ```

5. **Deploy the Contracts**
   Deploy the NFT and token contracts to a test network like Rinkeby or Goerli:
    ```bash
    npx hardhat run scripts/deploy.js --network rinkeby
    ```

6. **Add Liquidity to Uniswap V2**
   After deploying, you can add liquidity to the `RIP/WETH` pair using Uniswap V2 interface or by interacting with the contract directly.

### Testing

You can test the functionality of the contract using Hardhat:
```bash
npx hardhat test
