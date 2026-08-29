/** @type import('hardhat/config').HardhatUserConfig */
require('@nomicfoundation/hardhat-ethers');
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const accounts = PRIVATE_KEY ? [PRIVATE_KEY] : [];

module.exports = {
  solidity: {
    version: '0.8.20',
    settings: { optimizer: { enabled: true, runs: 200 }, viaIR: true },
  },
  networks: {
    hardhat: { chainId: 31337 },
    sepolia: { url: process.env.SEPOLIA_RPC_URL || 'https://rpc.sepolia.org', accounts, chainId: 11155111 },
    amoy: { url: process.env.AMOY_RPC_URL || 'https://rpc-amoy.polygon.technology', accounts, chainId: 80002 },
    baseSepolia: { url: process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org', accounts, chainId: 84532 },
    base: { url: process.env.BASE_RPC_URL || 'https://mainnet.base.org', accounts, chainId: 8453 },
  },
};

