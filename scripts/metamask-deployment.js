const CHAINS = {
  sepolia: {
    chainId: 11155111,
    chainIdHex: "0xaa36a7",
    name: "Ethereum Sepolia",
    symbol: "ETH",
    rpc: "https://ethereum-sepolia-rpc.publicnode.com",
    explorer: "https://sepolia.etherscan.io"
  },
  amoy: {
    chainId: 80002,
    chainIdHex: "0x13882",
    name: "Polygon Amoy",
    symbol: "POL",
    rpc: "https://polygon-amoy-bor-rpc.publicnode.com",
    explorer: "https://amoy.polygonscan.com"
  }
};

function requireMetaMask() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed.");
  }
  return window.ethereum;
}

async function connectMetaMask() {
  const ethereum = requireMetaMask();

  const accounts = await ethereum.request({
    method: "eth_requestAccounts"
  });

  if (!accounts || accounts.length === 0) {
    throw new Error("No MetaMask account selected.");
  }

  return accounts[0];
}

async function switchNetwork(network) {
  const ethereum = requireMetaMask();
  const chain = CHAINS[network];

  if (!chain) {
    throw new Error("Unsupported network: " + network);
  }

  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chain.chainIdHex }]
    });
  } catch (error) {
    if (error.code !== 4902) {
      throw error;
    }

    await ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: chain.chainIdHex,
        chainName: chain.name,
        nativeCurrency: {
          name: chain.symbol,
          symbol: chain.symbol,
          decimals: 18
        },
        rpcUrls: [chain.rpc],
        blockExplorerUrls: [chain.explorer]
      }]
    });
  }

  return true;
}

async function getWalletInfo(network) {
  const ethereum = requireMetaMask();
  const address = await connectMetaMask();

  await switchNetwork(network);

  const chainId = await ethereum.request({
    method: "eth_chainId"
  });

  const expected = CHAINS[network].chainIdHex;

  if (chainId.toLowerCase() !== expected.toLowerCase()) {
    throw new Error(
      "Wrong network. Expected " +
      CHAINS[network].name +
      " (" +
      expected +
      "), received " +
      chainId
    );
  }

  const balanceHex = await ethereum.request({
    method: "eth_getBalance",
    params: [address, "latest"]
  });

  const balanceWei = BigInt(balanceHex);
  const whole = balanceWei / 1000000000000000000n;
  const fraction = (balanceWei % 1000000000000000000n)
    .toString()
    .padStart(18, "0")
    .replace(/0+$/, "");

  return {
    network: CHAINS[network].name,
    chainId: CHAINS[network].chainId,
    address: address,
    balance: fraction
      ? whole.toString() + "." + fraction
      : whole.toString(),
    symbol: CHAINS[network].symbol
  };
}

window.SHOR_METAMASK = {
  CHAINS,
  connectMetaMask,
  switchNetwork,
  getWalletInfo
};

console.log("SHOR MetaMask module ready.");
console.log("Private keys are NOT requested.");
console.log("Seed phrases are NOT requested.");
console.log("Transactions are NOT sent automatically.");
