import { ethers } from "ethers";
import { SHOR_TESTNETS, SHOR_NETWORK_POLICY } from "../config/testnets";

function requireMetaMask() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed.");
  }
}

export async function connectMetaMask() {
  requireMetaMask();

  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }) as string[];

  if (!accounts || accounts.length === 0) {
    throw new Error("No MetaMask account selected.");
  }

  return accounts[0];
}

export async function switchToTestnet(networkKey) {
  requireMetaMask();

  if (!SHOR_NETWORK_POLICY.testnetsOnly) {
    throw new Error("Testnet-only policy is disabled.");
  }

  const network = SHOR_TESTNETS[networkKey];

  if (!network) {
    throw new Error(`Unknown SHOR testnet: ${networkKey}`);
  }

  const chainIdHex = "0x" + network.chainId.toString(16);

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }]
    });
  } catch (error) {
    if (error?.code !== 4902) {
      throw error;
    }

    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: chainIdHex,
        chainName: network.name,
        nativeCurrency: {
          name: network.nativeSymbol,
          symbol: network.nativeSymbol,
          decimals: 18
        },
        rpcUrls: [network.rpc],
        blockExplorerUrls: network.explorer
          ? [network.explorer]
          : []
      }]
    });
  }

  return network;
}

export async function getConnectedWallet(networkKey) {
  const address = await connectMetaMask();

  await switchToTestnet(networkKey);

  const network = SHOR_TESTNETS[networkKey];

  const provider = new ethers.BrowserProvider(window.ethereum);
  const actualNetwork = await provider.getNetwork();

  if (Number(actualNetwork.chainId) !== network.chainId) {
    throw new Error(
      `Wrong network. Expected ${network.chainId}, got ${actualNetwork.chainId}.`
    );
  }

  const balance = await provider.getBalance(address);

  return {
    address,
    network: network.name,
    chainId: network.chainId,
    symbol: network.nativeSymbol,
    balance: ethers.formatEther(balance)
  };
}

export function getSupportedTestnets() {
  return Object.values(SHOR_TESTNETS);
}

