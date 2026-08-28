/** @type import('hardhat/config').HardhatUserConfig */
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const accounts = PRIVATE_KEY ? [PRIVATE_KEY] : [];

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    hardhat: { chainId: 31337 },
    ethereum: { url: process.env.ETHEREUM_RPC_URL || "https://eth.llamarpc.com", accounts, chainId: 1 },
    polygon: { url: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com", accounts, chainId: 137 },
    arbitrum: { url: process.env.ARBITRUM_RPC_URL || "https://arb1.arbitrum.io/rpc", accounts, chainId: 42161 },
    base: { url: process.env.BASE_RPC_URL || "https://mainnet.base.org", accounts, chainId: 8453 },
    optimism: { url: process.env.OPTIMISM_RPC_URL || "https://mainnet.optimism.io", accounts, chainId: 10 },
    bsc: { url: process.env.BSC_RPC_URL || "https://bsc-dataseed.binance.org", accounts, chainId: 56 },
    avalanche: { url: process.env.AVALANCHE_RPC_URL || "https://api.avax.network/ext/bc/C/rpc", accounts, chainId: 43114 },
    sepolia: { url: process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org", accounts, chainId: 11155111 },
    amoy: { url: process.env.AMOY_RPC_URL || "https://rpc-amoy.polygon.technology", accounts, chainId: 80002 },
  },
};
