const { ethers } = require('hardhat');
const fs = require('fs');
const path = require('path');

const TARGETS = {
  sepolia: { chainId: 11155111 },
  amoy: { chainId: 80002 },
  baseSepolia: { chainId: 84532 },
};

async function deploy(networkName) {
  const expected = TARGETS[networkName];
  if (!expected) throw new Error(`Unsupported deployment network: ${networkName}`);

  const network = await ethers.provider.getNetwork();
  if (Number(network.chainId) !== expected.chainId) {
    throw new Error(`Wrong network: expected ${expected.chainId}, got ${network.chainId}`);
  }

  const [deployer] = await ethers.getSigners();
  const signerAddress = await deployer.getAddress();
  console.log(`Deploying SHOR contracts to ${networkName} from ${signerAddress}`);

  const tokenFactory = await ethers.getContractFactory('PQCERC20');
  const token = await tokenFactory.deploy(1_000_000);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();

  const nftFactory = await ethers.getContractFactory('PQCNFT');
  const nft = await nftFactory.deploy();
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();

  const bridgeFactory = await ethers.getContractFactory('QuantumMultichainBridge');
  const bridge = await bridgeFactory.deploy(tokenAddress, expected.chainId, signerAddress);
  await bridge.waitForDeployment();
  const bridgeAddress = await bridge.getAddress();

  const bridgeTx = await token.setBridgeContract(bridgeAddress);
  const bridgeReceipt = await bridgeTx.wait();

  const deployment = {
    network: networkName,
    chainId: expected.chainId,
    deployer: signerAddress,
    contracts: {
      PQCERC20_InfiniteSupply: tokenAddress,
      PQCNFT_PostQuantumERC721: nftAddress,
      QuantumMultichainBridge: bridgeAddress,
    },
    transactions: {
      PQCERC20: token.deploymentTransaction()?.hash,
      PQCNFT: nft.deploymentTransaction()?.hash,
      QuantumMultichainBridge: bridge.deploymentTransaction()?.hash,
      setBridgeContract: bridgeReceipt?.hash,
    },
    status: 'DEPLOYED',
    timestamp: new Date().toISOString(),
  };

  const outPath = path.join(__dirname, '..', `deployments-${networkName}.json`);
  fs.writeFileSync(outPath, JSON.stringify(deployment, null, 2) + '\n');
  console.log(JSON.stringify(deployment, null, 2));
}

async function main() {
  const networkName = process.env.DEPLOY_NETWORK || process.argv[2];
  if (!networkName) {
    throw new Error('Usage: npx hardhat run scripts/deploy-testnet.cjs --network baseSepolia');
  }
  await deploy(networkName);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
