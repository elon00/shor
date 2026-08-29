export const SHOR_TESTNETS = {
  sepolia: {
    key: "sepolia",
    name: "Ethereum Sepolia Testnet",
    chainId: 11155111,
    nativeSymbol: "ETH",
    rpc: "https://ethereum-sepolia-rpc.publicnode.com",
    explorer: "https://sepolia.etherscan.io",
    testnet: true,
    mainnet: false
  },

  monad: {
    key: "monad",
    name: "Monad Testnet",
    chainId: 10143,
    nativeSymbol: "MON",
    rpc: "https://testnet-rpc.monad.xyz",
    explorer: "https://testnet.monadexplorer.com",
    testnet: true,
    mainnet: false
  },

  somnia: {
    key: "somnia",
    name: "Somnia Shannon Testnet",
    chainId: 50312,
    nativeSymbol: "STT",
    rpc: "https://dream-rpc.somnia.network",
    explorer: "https://shannon-explorer.somnia.network",
    testnet: true,
    mainnet: false
  },

  gensyn: {
    key: "gensyn",
    name: "Gensyn AI Compute Testnet",
    chainId: 63428,
    nativeSymbol: "GEN",
    rpc: "https://rpc.gensyn.ai/testnet",
    explorer: "",
    testnet: true,
    mainnet: false
  },

  polygonAmoy: {
    key: "polygon-amoy",
    name: "Polygon Amoy Testnet",
    chainId: 80002,
    nativeSymbol: "POL",
    rpc: "https://rpc-amoy.polygon.technology",
    explorer: "https://amoy.polygonscan.com",
    testnet: true,
    mainnet: false
  },

  baseSepolia: {
    key: "base-sepolia",
    name: "Base Sepolia Testnet",
    chainId: 84532,
    nativeSymbol: "ETH",
    rpc: "https://sepolia.base.org",
    explorer: "https://sepolia.basescan.org",
    testnet: true,
    mainnet: false
  },

  arbitrumSepolia: {
    key: "arbitrum-sepolia",
    name: "Arbitrum Sepolia Testnet",
    chainId: 421614,
    nativeSymbol: "ETH",
    rpc: "https://sepolia-rollup.arbitrum.io/rpc",
    explorer: "https://sepolia.arbiscan.io",
    testnet: true,
    mainnet: false
  },

  bnbTestnet: {
    key: "bnb-testnet",
    name: "BNB Smart Chain Testnet",
    chainId: 97,
    nativeSymbol: "tBNB",
    rpc: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
    explorer: "https://testnet.bscscan.com",
    testnet: true,
    mainnet: false
  },

  avalancheFuji: {
    key: "avalanche-fuji",
    name: "Avalanche Fuji Testnet",
    chainId: 43113,
    nativeSymbol: "AVAX",
    rpc: "https://api.avax-test.network/ext/bc/C/rpc",
    explorer: "https://testnet.snowtrace.io",
    testnet: true,
    mainnet: false
  }
};

export const SHOR_NETWORK_POLICY = {
  testnetsOnly: true,
  allowMainnet: false,
  automaticSigning: false,
  automaticTransactions: false,
  privateKeysAllowed: false,
  seedPhrasesAllowed: false
};
