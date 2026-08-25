# 🌐 Nameless Web 4.0: Multichain Deployment & Architecture Guide

## Overview
Nameless Web 4.0 is an enterprise-grade **Post-Quantum Cryptography & Conway AI Automaton** platform deployed across **9 EVM Blockchains**:
- **Ethereum Mainnet & Sepolia Testnet**
- **Polygon PoS & Polygon Amoy Testnet**
- **Arbitrum One** (Layer-2 Rollup)
- **Base Mainnet** (Coinbase Layer-2 OP Stack)
- **Optimism (OP Mainnet)**
- **BNB Smart Chain (BSC)**
- **Avalanche C-Chain**

---

## 🛠️ Smart Contracts Suite
1. **`PQCERC20.sol`**: Multi-Chain ERC-20 standard token ($PQC) with FIPS 203 ML-KEM-768 lattice state verification and cross-chain bridge mint/burn mechanisms.
2. **`PQCNFT.sol`**: Multi-Chain ERC-721 token representing evolved cellular automaton nodes with on-chain quantum resilience scores and lattice signatures.
3. **`QuantumMultichainBridge.sol`**: Cryptographically-secure lock-and-mint cross-chain bridge verifying post-quantum state signatures.

---

## 🚀 How to Deploy Smart Contracts

### 1. Run Automated Multichain Deployment
```bash
node scripts/deploy-multichain.js
```
This script deploys the contracts to all 9 supported chains and outputs `deployments.json`.

### 2. Deploy to a Specific Chain via Hardhat
```bash
# Ethereum Sepolia
npx hardhat run scripts/deploy-multichain.js --network sepolia

# Polygon Amoy
npx hardhat run scripts/deploy-multichain.js --network amoy

# Arbitrum One
npx hardhat run scripts/deploy-multichain.js --network arbitrum

# Base Mainnet
npx hardhat run scripts/deploy-multichain.js --network base
```

---

## 🐳 Docker Container Deployment
```bash
# Build and run locally with Docker Compose
docker compose up --build -d
```

---

## ☁️ Cloud / Serverless Deployment (Vercel / Render)
- **Render**: Connect repository and select `render.yaml`.
- **Vercel**: Run `vercel deploy` with the provided `vercel.json`.
