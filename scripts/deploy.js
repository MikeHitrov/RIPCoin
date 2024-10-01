const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy NFT contract first
  const RIPCoinNFT = await hre.ethers.getContractFactory("RIPCoinNFT");
  const nftContract = await RIPCoinNFT.deploy();
  await nftContract.deployed();

  console.log("RIPCoinNFT deployed to:", nftContract.address);

  // Deploy RIPCoin token contract
  const RIPCoin = await hre.ethers.getContractFactory("RIPCoin");
  const ripCoin = await RIPCoin.deploy(deployer.address, nftContract.address);
  await ripCoin.deployed();

  console.log("RIPCoin deployed to:", ripCoin.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
