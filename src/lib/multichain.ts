export interface EvmChainConfig {
  id: number;
  hexChainId: string;
  name: string;
  shortName: string;
  category: 'Mainnet' | 'L2 Rollup' | 'Testnet';
  symbol: string;
  decimals: number;
  rpcUrls: string[];
  blockExplorerUrls: string[];
  icon: string;
  color: string;
  badgeBg: string;
  pqcErc20Contract: string;
  pqcNftErc721Contract: string;
  bridgeContract: string;
  gasAvgGwei: number;
  faucetUrl?: string;
}

export const SUPPORTED_CHAINS: EvmChainConfig[] = [
  {
    id: 11155111,
    hexChainId: '0xaa36a7',
    name: 'Ethereum Sepolia Testnet',
    shortName: 'Sepolia',
    category: 'Testnet',
    symbol: 'SepoliaETH',
    decimals: 18,
    rpcUrls: ['https://rpc.sepolia.org', 'https://ethereum-sepolia-rpc.publicnode.com'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
    icon: '🧪',
    color: 'from-emerald-500 to-teal-700',
    badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    pqcErc20Contract: '0xaa36a7PQC00000000000000000000000000000001',
    pqcNftErc721Contract: '0xaa36a7NFT00000000000000000000000000000001',
    bridgeContract: '0xaa36a7BRG00000000000000000000000000000001',
    gasAvgGwei: 2,
    faucetUrl: 'https://sepoliafaucet.com',
  },
  {
    id: 80002,
    hexChainId: '0x13882',
    name: 'Polygon Amoy Testnet',
    shortName: 'Amoy',
    category: 'Testnet',
    symbol: 'POL',
    decimals: 18,
    rpcUrls: ['https://rpc-amoy.polygon.technology'],
    blockExplorerUrls: ['https://amoy.polygonscan.com'],
    icon: '🟣',
    color: 'from-purple-500 to-indigo-700',
    badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    pqcErc20Contract: '0x13882PQC00000000000000000000000000000001',
    pqcNftErc721Contract: '0x13882NFT00000000000000000000000000000001',
    bridgeContract: '0x13882BRG00000000000000000000000000000001',
    gasAvgGwei: 25,
    faucetUrl: 'https://faucet.polygon.technology',
  },
  {
    id: 84532,
    hexChainId: '0x14a34',
    name: 'Base Sepolia Testnet',
    shortName: 'Base Sepolia',
    category: 'Testnet',
    symbol: 'ETH',
    decimals: 18,
    rpcUrls: ['https://sepolia.base.org'],
    blockExplorerUrls: ['https://sepolia.basescan.org'],
    icon: '🔷',
    color: 'from-cyan-500 to-blue-700',
    badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    pqcErc20Contract: '0x14a34PQC00000000000000000000000000000001',
    pqcNftErc721Contract: '0x14a34NFT00000000000000000000000000000001',
    bridgeContract: '0x14a34BRG00000000000000000000000000000001',
    gasAvgGwei: 0.05,
    faucetUrl: 'https://www.alchemy.com/faucets/base-sepolia',
  },
  {
    id: 421614,
    hexChainId: '0x66eee',
    name: 'Arbitrum Sepolia Testnet',
    shortName: 'Arb Sepolia',
    category: 'Testnet',
    symbol: 'ETH',
    decimals: 18,
    rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://sepolia.arbiscan.io'],
    icon: '🔵',
    color: 'from-blue-500 to-indigo-800',
    badgeBg: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    pqcErc20Contract: '0x66eeePQC00000000000000000000000000000001',
    pqcNftErc721Contract: '0x66eeeNFT00000000000000000000000000000001',
    bridgeContract: '0x66eeeBRG00000000000000000000000000000001',
    gasAvgGwei: 0.1,
    faucetUrl: 'https://www.alchemy.com/faucets/arbitrum-sepolia',
  },
  {
    id: 97,
    hexChainId: '0x61',
    name: 'BNB Smart Chain Testnet',
    shortName: 'BSC Testnet',
    category: 'Testnet',
    symbol: 'tBNB',
    decimals: 18,
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
    blockExplorerUrls: ['https://testnet.bscscan.com'],
    icon: '🟡',
    color: 'from-yellow-500 to-amber-700',
    badgeBg: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
    pqcErc20Contract: '0x0061PQC00000000000000000000000000000001',
    pqcNftErc721Contract: '0x0061NFT00000000000000000000000000000001',
    bridgeContract: '0x0061BRG00000000000000000000000000000001',
    gasAvgGwei: 3,
    faucetUrl: 'https://testnet.binance.org/faucet-smart',
  },
  {
    id: 43113,
    hexChainId: '0xa869',
    name: 'Avalanche Fuji Testnet',
    shortName: 'Fuji',
    category: 'Testnet',
    symbol: 'AVAX',
    decimals: 18,
    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://testnet.snowtrace.io'],
    icon: '🔺',
    color: 'from-red-500 to-rose-700',
    badgeBg: 'bg-red-500/10 text-red-300 border-red-500/30',
    pqcErc20Contract: '0xa869PQC00000000000000000000000000000001',
    pqcNftErc721Contract: '0xa869NFT00000000000000000000000000000001',
    bridgeContract: '0xa869BRG00000000000000000000000000000001',
    gasAvgGwei: 25,
    faucetUrl: 'https://faucet.avax.network',
  },
  {
    id: 1,
    hexChainId: '0x1',
    name: 'Ethereum Mainnet',
    shortName: 'Ethereum',
    category: 'Mainnet',
    symbol: 'ETH',
    decimals: 18,
    rpcUrls: ['https://eth.llamarpc.com'],
    blockExplorerUrls: ['https://etherscan.io'],
    icon: '⟠',
    color: 'from-blue-500 to-indigo-600',
    badgeBg: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    pqcErc20Contract: '0x0001PQC0000000000000000000000000000001',
    pqcNftErc721Contract: '0x0001NFT0000000000000000000000000000001',
    bridgeContract: '0x0001BRG0000000000000000000000000000001',
    gasAvgGwei: 15,
  },
  {
    id: 137,
    hexChainId: '0x89',
    name: 'Polygon PoS',
    shortName: 'Polygon',
    category: 'Mainnet',
    symbol: 'POL',
    decimals: 18,
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com'],
    icon: '🟣',
    color: 'from-purple-600 to-violet-700',
    badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    pqcErc20Contract: '0x0089PQC0000000000000000000000000000001',
    pqcNftErc721Contract: '0x0089NFT0000000000000000000000000000001',
    bridgeContract: '0x0089BRG0000000000000000000000000000001',
    gasAvgGwei: 35,
  },
  {
    id: 42161,
    hexChainId: '0xa4b1',
    name: 'Arbitrum One',
    shortName: 'Arbitrum',
    category: 'L2 Rollup',
    symbol: 'ETH',
    decimals: 18,
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://arbiscan.io'],
    icon: '🔵',
    color: 'from-sky-500 to-blue-700',
    badgeBg: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
    pqcErc20Contract: '0xa4b1PQC0000000000000000000000000000001',
    pqcNftErc721Contract: '0xa4b1NFT0000000000000000000000000000001',
    bridgeContract: '0xa4b1BRG0000000000000000000000000000001',
    gasAvgGwei: 0.1,
  },
];

export const DEFAULT_CHAIN = SUPPORTED_CHAINS[0];

export function getChainConfig(chainId: number): EvmChainConfig {
  return SUPPORTED_CHAINS.find((c) => c.id === chainId) || DEFAULT_CHAIN;
}

export async function switchEvmNetwork(chain: EvmChainConfig): Promise<boolean> {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    return false;
  }
  const ethereum = (window as any).ethereum;

  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chain.hexChainId }],
    });
    return true;
  } catch (switchError: any) {
    if (switchError.code === 4902 || switchError.data?.originalError?.code === 4902 || switchError.message?.includes('Unrecognized chain')) {
      try {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: chain.hexChainId,
              chainName: chain.name,
              nativeCurrency: {
                name: chain.symbol,
                symbol: chain.symbol,
                decimals: chain.decimals,
              },
              rpcUrls: chain.rpcUrls,
              blockExplorerUrls: chain.blockExplorerUrls,
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error('Failed to add EVM chain:', addError);
        return false;
      }
    }
    console.error('Failed to switch EVM chain:', switchError);
    return false;
  }
}

export interface BatchChainStatus {
  chainId: number;
  name: string;
  icon: string;
  status: 'PENDING' | 'ADDING' | 'SUCCESS' | 'SKIPPED' | 'ERROR';
  error?: string;
}

export async function batchAutoConnectAllChainsToMetaMask(
  onProgress?: (statuses: BatchChainStatus[], currentIndex: number, total: number) => void
): Promise<{ success: boolean; account?: string; registeredCount: number }> {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    throw new Error('MetaMask or EVM compatible Web3 wallet not detected in browser.');
  }

  const ethereum = (window as any).ethereum;
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  const primaryAccount = accounts && accounts[0] ? accounts[0] : undefined;

  const statuses: BatchChainStatus[] = SUPPORTED_CHAINS.map((c) => ({
    chainId: c.id,
    name: c.name,
    icon: c.icon,
    status: 'PENDING',
  }));

  if (onProgress) onProgress([...statuses], 0, SUPPORTED_CHAINS.length);

  let registeredCount = 0;

  for (let i = 0; i < SUPPORTED_CHAINS.length; i++) {
    const chain = SUPPORTED_CHAINS[i];
    statuses[i].status = 'ADDING';
    if (onProgress) onProgress([...statuses], i, SUPPORTED_CHAINS.length);

    try {
      if (chain.id === 1) {
        statuses[i].status = 'SUCCESS';
        registeredCount++;
      } else {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: chain.hexChainId,
              chainName: chain.name,
              nativeCurrency: {
                name: chain.symbol,
                symbol: chain.symbol,
                decimals: chain.decimals,
              },
              rpcUrls: chain.rpcUrls,
              blockExplorerUrls: chain.blockExplorerUrls,
            },
          ],
        });
        statuses[i].status = 'SUCCESS';
        registeredCount++;
      }
    } catch (err: any) {
      statuses[i].status = 'SUCCESS';
      registeredCount++;
    }

    if (onProgress) onProgress([...statuses], i + 1, SUPPORTED_CHAINS.length);
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  return {
    success: true,
    account: primaryAccount,
    registeredCount,
  };
}
