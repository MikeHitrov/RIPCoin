const { ethers } = require("hardhat");
require("dotenv").config();

// Uniswap V2 Router address (for mainnet or testnet)
const UNISWAP_V2_ROUTER_ADDRESS = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"; // Replace with the correct address for the network

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Adding liquidity with the account:", deployer.address);

  // Get the deployed RIPCoin token contract address
  const ripCoinAddress = "<RIPCOIN_CONTRACT_ADDRESS>"; // Replace with your deployed RIPCoin address
  const tokenContract = await ethers.getContractAt("ERC20", ripCoinAddress);

  // Uniswap V2 Router contract interface
  const uniswapRouter = await ethers.getContractAt(
    "IUniswapV2Router02",
    UNISWAP_V2_ROUTER_ADDRESS
  );

  // Define how much token and ETH you want to provide
  const tokenAmount = ethers.utils.parseUnits("1000", 18); // 1000 RIPCoins
  const ethAmount = ethers.utils.parseEther("0.5"); // 0.5 ETH (in wei)

  // Approve Uniswap Router to spend RIPCoin tokens on behalf of the deployer
  const approvalTx = await tokenContract.approve(
    UNISWAP_V2_ROUTER_ADDRESS,
    tokenAmount
  );
  await approvalTx.wait();
  console.log(`Approved ${tokenAmount} tokens for Uniswap Router`);

  // Add liquidity to Uniswap V2 (RIP/WETH pool)
  const tx = await uniswapRouter.addLiquidityETH(
    ripCoinAddress,
    tokenAmount, // Amount of RIPCoins
    0, // Min amount of RIPCoins (slippage tolerance)
    0, // Min amount of ETH (slippage tolerance)
    deployer.address, // Liquidity tokens will be sent to deployer's address
    Math.floor(Date.now() / 1000) + 60 * 10, // Deadline 10 minutes from now
    { value: ethAmount } // Send ETH with the transaction
  );

  await tx.wait();

  console.log(
    `Liquidity added successfully: ${tokenAmount.toString()} RIPCoin and ${ethAmount.toString()} ETH`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error adding liquidity:", error);
    process.exit(1);
  });
