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
    id: 1,
    hexChainId: '0x1',
    name: 'Ethereum Mainnet',
    shortName: 'Ethereum',
    category: 'Mainnet',
    symbol: 'ETH',
    decimals: 18,
    rpcUrls: ['https://eth.llamarpc.com', 'https://rpc.ankr.com/eth'],
    blockExplorerUrls: ['https://etherscan.io'],
    icon: '⟠',
    color: 'from-blue-500 to-indigo-600',
    badgeBg: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    pqcErc20Contract: '0x3F88a5291cD9173aB3D0101bA48a97f26792671A',
    pqcNftErc721Contract: '0x88C02B9119A54a88E45447a2F272719B53Fa6811',
    bridgeContract: '0x7128Da601272bE129A88712C9a224976a16A192B',
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
    rpcUrls: ['https://polygon-rpc.com', 'https://rpc.ankr.com/polygon'],
    blockExplorerUrls: ['https://polygonscan.com'],
    icon: '🟣',
    color: 'from-purple-600 to-violet-700',
    badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    pqcErc20Contract: '0x992B19F2e617d3b5A720C69a23F405E118Fa2201',
    pqcNftErc721Contract: '0x44B127918a2219eD991C28182910Fa7294A18202',
    bridgeContract: '0x66B7291aBc54201198A287b4991A5722cD189211',
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
    rpcUrls: ['https://arb1.arbitrum.io/rpc', 'https://rpc.ankr.com/arbitrum'],
    blockExplorerUrls: ['https://arbiscan.io'],
    icon: '🔵',
    color: 'from-sky-500 to-blue-700',
    badgeBg: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
    pqcErc20Contract: '0x22A8119cF2b918D3b1029Ac3456B9178E91A1101',
    pqcNftErc721Contract: '0x77E1208bC317d091A4B022b74051a89c92Fa0012',
    bridgeContract: '0x11D88aBc90241A092305B9210C1a877D912b4033',
    gasAvgGwei: 0.1,
  },
  {
    id: 8453,
    hexChainId: '0x2105',
    name: 'Base Mainnet',
    shortName: 'Base',
    category: 'L2 Rollup',
    symbol: 'ETH',
    decimals: 18,
    rpcUrls: ['https://mainnet.base.org', 'https://base.llamarpc.com'],
    blockExplorerUrls: ['https://basescan.org'],
    icon: '🔷',
    color: 'from-blue-600 to-cyan-500',
    badgeBg: 'bg-blue-600/10 text-cyan-300 border-cyan-500/30',
    pqcErc20Contract: '0x55E9240A182C019d854B72a29481E9Fa0012711C',
    pqcNftErc721Contract: '0x19B829FaD992c4819A028bA9280b19280aC94021',
    bridgeContract: '0x889A120cC419aD02B219808AbC1920Fa7711B802',
    gasAvgGwei: 0.05,
  },
  {
    id: 10,
    hexChainId: '0xa',
    name: 'Optimism (OP Mainnet)',
    shortName: 'Optimism',
    category: 'L2 Rollup',
    symbol: 'ETH',
    decimals: 18,
    rpcUrls: ['https://mainnet.optimism.io', 'https://optimism.llamarpc.com'],
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
    icon: '🔴',
    color: 'from-red-500 to-rose-600',
    badgeBg: 'bg-red-500/10 text-rose-300 border-red-500/30',
    pqcErc20Contract: '0x10E88bA72491a0B91C12847A294c6B78129031aA',
    pqcNftErc721Contract: '0x334Ca7890bF129a88A24b0718a22497Fa901B112',
    bridgeContract: '0x55B0912Aa8021B1924bA7710Ba09217a8B920044',
    gasAvgGwei: 0.08,
  },
  {
    id: 56,
    hexChainId: '0x38',
    name: 'BNB Smart Chain',
    shortName: 'BNB Chain',
    category: 'Mainnet',
    symbol: 'BNB',
    decimals: 18,
    rpcUrls: ['https://bsc-dataseed.binance.org', 'https://rpc.ankr.com/bsc'],
    blockExplorerUrls: ['https://bscscan.com'],
    icon: '🟡',
    color: 'from-amber-500 to-yellow-600',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    pqcErc20Contract: '0xBB82109cFb0219Aa773091B8721199Af77413009',
    pqcNftErc721Contract: '0x99A1009Cb17169A0837bBa7249a8819Ba9926610',
    bridgeContract: '0x33B109AaF11082Ba10928aA78921Fa00Ba672109',
    gasAvgGwei: 3,
  },
  {
    id: 43114,
    hexChainId: '0xa86a',
    name: 'Avalanche C-Chain',
    shortName: 'Avalanche',
    category: 'Mainnet',
    symbol: 'AVAX',
    decimals: 18,
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://snowtrace.io'],
    icon: '🔺',
    color: 'from-red-600 to-red-800',
    badgeBg: 'bg-red-600/10 text-red-300 border-red-600/30',
    pqcErc20Contract: '0xAA82190BfaC01982bBA1092Bca781200Ba88123A',
    pqcNftErc721Contract: '0x44C198aA029Bb19277aBBa72199bAA8190014412',
    bridgeContract: '0x77B901AaC88019bBA71029Ba788109Ac770198A2',
    gasAvgGwei: 25,
  },
  {
    id: 11155111,
    hexChainId: '0xaa36a7',
    name: 'Sepolia Testnet',
    shortName: 'Sepolia',
    category: 'Testnet',
    symbol: 'SepoliaETH',
    decimals: 18,
    rpcUrls: ['https://rpc.sepolia.org', 'https://ethereum-sepolia.blockpi.network/v1/rpc/public'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
    icon: '🧪',
    color: 'from-emerald-500 to-teal-700',
    badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    pqcErc20Contract: '0x11155111PQC00000000000000000000000000001',
    pqcNftErc721Contract: '0x11155111NFT00000000000000000000000000001',
    bridgeContract: '0x11155111BRG00000000000000000000000000001',
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
    color: 'from-purple-500 to-pink-600',
    badgeBg: 'bg-pink-500/10 text-pink-300 border-pink-500/30',
    pqcErc20Contract: '0x80002000PQC00000000000000000000000000001',
    pqcNftErc721Contract: '0x80002000NFT00000000000000000000000000001',
    bridgeContract: '0x80002000BRG00000000000000000000000000001',
    gasAvgGwei: 5,
    faucetUrl: 'https://faucet.polygon.technology',
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
    if (switchError.code === 4902 || switchError.data?.originalError?.code === 4902) {
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
