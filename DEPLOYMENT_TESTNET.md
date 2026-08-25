# 🧪 Nameless Web 4.0: Testnet Deployment & Faucet Guide

Deploy Nameless Web 4.0 smart contracts and the fullstack Web 4.0 dApp to EVM Testnets.

## Supported Testnets
1. **Ethereum Sepolia** (Chain ID: `11155111`) • [Sepolia Faucet](https://sepoliafaucet.com)
2. **Polygon Amoy** (Chain ID: `80002`) • [Amoy Faucet](https://faucet.polygon.technology)
3. **Base Sepolia** (Chain ID: `84532`) • [Base Faucet](https://www.alchemy.com/faucets/base-sepolia)
4. **Arbitrum Sepolia** (Chain ID: `421614`) • [Arbitrum Faucet](https://www.alchemy.com/faucets/arbitrum-sepolia)
5. **BNB Chain Testnet** (Chain ID: `97`) • [BSC Testnet Faucet](https://testnet.binance.org/faucet-smart)
6. **Avalanche Fuji** (Chain ID: `43113`) • [Fuji Faucet](https://faucet.avax.network)

---

## 🚀 1-Command Automated Testnet Deployment
```bash
node scripts/deploy-testnet.cjs
```
This deploys the 3 smart contracts:
- `PQCERC20.sol` (Unlimited Supply Quantum Energy Token)
- `PQCNFT.sol` (Post-Quantum Conway Automaton ERC-721 NFT)
- `QuantumMultichainBridge.sol` (Cross-Chain Lattice State Relay)

And outputs `testnet-deployments.json`.

---

## ⚡ Run Full-Stack Local / Testnet Node
```bash
npm install
npm run build
npm start
```
App will start on `http://localhost:3000` with the Testnet Network Switcher active by default!
