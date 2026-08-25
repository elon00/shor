import React, { useState } from 'react';
import { Web3WalletState } from '../types';
import { SUPPORTED_CHAINS, getChainConfig, switchEvmNetwork } from '../lib/multichain';
import { Wallet, Shield, Sparkles, Coins, ExternalLink, RefreshCw, CheckCircle2, ChevronDown, IndianRupee, ArrowLeftRight, Globe, Layers } from 'lucide-react';

interface Web3WalletBarProps {
  wallet: Web3WalletState;
  setWallet: React.Dispatch<React.SetStateAction<Web3WalletState>>;
  onClaimAirdrop: () => void;
  onOpenBridge: () => void;
  onAddTerminalMessage?: (msg: string) => void;
}

export const Web3WalletBar: React.FC<Web3WalletBarProps> = ({
  wallet,
  setWallet,
  onClaimAirdrop,
  onOpenBridge,
  onAddTerminalMessage,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showNetworkMenu, setShowNetworkMenu] = useState(false);
  const [hasClaimedAirdrop, setHasClaimedAirdrop] = useState(false);

  const currentChain = getChainConfig(wallet.chainId || 1);

  const handleNetworkSelect = async (chainId: number) => {
    setShowNetworkMenu(false);
    const targetChain = getChainConfig(chainId);
    
    // Switch in MetaMask if connected
    if (wallet.isMetaMaskDetected && typeof window !== 'undefined' && (window as any).ethereum) {
      await switchEvmNetwork(targetChain);
    }

    setWallet((prev) => ({
      ...prev,
      chainId: targetChain.id,
      network: targetChain.name,
      pqcErc20Contract: targetChain.pqcErc20Contract,
      pqcNftErc721Contract: targetChain.pqcNftErc721Contract,
      bridgeContract: targetChain.bridgeContract,
    }));

    if (onAddTerminalMessage) {
      onAddTerminalMessage(`🌐 [MULTICHAIN] Switched active network to ${targetChain.name} (Chain ID: ${targetChain.id}). Contracts loaded.`);
    }
  };

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        const chainIdHex = await (window as any).ethereum.request({ method: 'eth_chainId' });
        const chainIdInt = parseInt(chainIdHex, 16) || 1;
        const chainConfig = getChainConfig(chainIdInt);

        if (accounts && accounts[0]) {
          setWallet((prev) => ({
            ...prev,
            isConnected: true,
            address: accounts[0],
            chainId: chainConfig.id,
            network: chainConfig.name,
            isMetaMaskDetected: true,
            pqcErc20Contract: chainConfig.pqcErc20Contract,
            pqcNftErc721Contract: chainConfig.pqcNftErc721Contract,
            bridgeContract: chainConfig.bridgeContract,
          }));
        }
      } catch (err) {
        console.warn('MetaMask connection rejected, using simulated Multichain wallet:', err);
        connectSimulatedWallet();
      }
    } else {
      setTimeout(() => {
        connectSimulatedWallet();
      }, 500);
    }
    setIsConnecting(false);
  };

  const connectSimulatedWallet = () => {
    const randomHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const chainConfig = getChainConfig(wallet.chainId || 1);
    setWallet((prev) => ({
      ...prev,
      isConnected: true,
      address: `0x${randomHex.substring(0, 4)}...${randomHex.substring(36)}`,
      network: chainConfig.name,
      chainId: chainConfig.id,
      ethBalance: 3.485,
      nativeBalance: 3.485,
      pqcTokenBalance: 12500,
      inrBalance: 85400,
      pqcErc20Contract: chainConfig.pqcErc20Contract,
      pqcNftErc721Contract: chainConfig.pqcNftErc721Contract,
      bridgeContract: chainConfig.bridgeContract,
    }));
  };

  const handleDisconnect = () => {
    setWallet((prev) => ({
      ...prev,
      isConnected: false,
    }));
  };

  const handleAirdropClick = () => {
    if (hasClaimedAirdrop) return;
    onClaimAirdrop();
    setHasClaimedAirdrop(true);
    setWallet((prev) => ({
      ...prev,
      pqcTokenBalance: prev.pqcTokenBalance + 500,
      ethBalance: parseFloat((prev.ethBalance + 0.1).toFixed(3)),
      nativeBalance: parseFloat(((prev.nativeBalance || 0) + 0.1).toFixed(3)),
      inrBalance: prev.inrBalance + 10000,
    }));
  };

  return (
    <div className="bg-slate-900/95 border-b border-slate-800 px-3 py-2 text-xs font-mono flex flex-wrap items-center justify-between gap-2.5 shadow-md backdrop-blur-md sticky top-0 z-40">
      {/* Left: Web3 Network Selector & Hackathon Badge */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
          MULTICHAIN WEB 4.0
        </span>

        {/* Network Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNetworkMenu(!showNetworkMenu)}
            className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 px-2.5 py-1 rounded-md border border-slate-700/80 transition text-[11px]"
          >
            <span>{currentChain.icon}</span>
            <span className="font-semibold">{currentChain.shortName}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showNetworkMenu && (
            <div className="absolute left-0 mt-1.5 w-60 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 max-h-80 overflow-y-auto">
              <div className="text-[10px] text-slate-400 px-2 py-1 font-mono uppercase tracking-wider">
                Select EVM Chain
              </div>
              {SUPPORTED_CHAINS.map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => handleNetworkSelect(chain.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition ${
                    wallet.chainId === chain.id
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{chain.icon}</span>
                    <div>
                      <div className="font-semibold leading-tight">{chain.shortName}</div>
                      <div className="text-[10px] text-slate-400">{chain.category} • {chain.symbol}</div>
                    </div>
                  </div>
                  {wallet.chainId === chain.id && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Cross-Chain Bridge Button */}
        <button
          onClick={onOpenBridge}
          className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 hover:from-indigo-800/80 hover:to-purple-800/80 text-indigo-200 border border-indigo-700/60 px-2.5 py-1 rounded-md text-[11px] transition shadow-sm"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-400" />
          <span>Multichain Bridge</span>
        </button>

        {/* Contract Info Modal Trigger */}
        <button
          onClick={() => setShowContractModal(!showContractModal)}
          className="text-slate-300 hover:text-cyan-400 text-[11px] flex items-center gap-1 transition bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800"
        >
          <Shield className="w-3 h-3 text-cyan-400" />
          <span>Deployed Contracts</span>
        </button>
      </div>

      {/* Right: Balances & Wallet Connect Button */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {wallet.isConnected ? (
          <>
            {/* Balances Display */}
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
              <div className="flex items-center gap-1 text-slate-300">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold text-slate-100">{wallet.ethBalance}</span>
                <span className="text-[10px] text-slate-400">{currentChain.symbol}</span>
              </div>

              <div className="h-3 w-px bg-slate-800" />

              <div className="flex items-center gap-1 text-cyan-400">
                <span className="font-bold">{wallet.pqcTokenBalance.toLocaleString()}</span>
                <span className="text-[10px] text-cyan-300">$PQC</span>
              </div>

              <div className="h-3 w-px bg-slate-800" />

              <div className="flex items-center gap-1 text-emerald-400 font-sans">
                <IndianRupee className="w-3 h-3" />
                <span className="font-bold">{wallet.inrBalance.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-emerald-300 font-mono">INR</span>
              </div>
            </div>

            {/* Airdrop Button */}
            <button
              onClick={handleAirdropClick}
              disabled={hasClaimedAirdrop}
              className={`px-2.5 py-1 rounded-md font-sans text-[11px] font-semibold flex items-center gap-1 transition ${
                hasClaimedAirdrop
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-sm'
              }`}
            >
              {hasClaimedAirdrop ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Airdrop Claimed!
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 text-yellow-300 animate-bounce" />
                  Claim +500 $PQC & ₹10k
                </>
              )}
            </button>

            {/* Wallet Address pill */}
            <div className="flex items-center gap-1 bg-cyan-950/60 border border-cyan-800/80 px-2.5 py-1 rounded-md text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{wallet.address}</span>
              <button
                onClick={handleDisconnect}
                className="ml-1 text-[10px] text-slate-400 hover:text-red-400 underline"
                title="Disconnect Wallet"
              >
                Disconnect
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={handleConnectWallet}
            disabled={isConnecting}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-sans text-xs font-semibold flex items-center gap-2 transition shadow-lg shadow-cyan-900/30"
          >
            {isConnecting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Connecting Wallet...
              </>
            ) : (
              <>
                <Wallet className="w-3.5 h-3.5" />
                Connect Multichain Wallet
              </>
            )}
          </button>
        )}
      </div>

      {/* Contract Address & Web3 Verification Modal */}
      {showContractModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-lg w-full shadow-2xl text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2 text-cyan-400 font-bold font-sans">
                <Shield className="w-5 h-5 text-cyan-400" />
                Multichain Smart Contract Architecture
              </div>
              <button
                onClick={() => setShowContractModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px]">ACTIVE BLOCKCHAIN</div>
                <div className="text-white font-bold flex items-center gap-2 mt-1">
                  <span>{currentChain.icon}</span>
                  <span>{currentChain.name} (Chain ID: {currentChain.id})</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px]">ERC-20 TOKEN CONTRACT ($PQC)</div>
                <div className="text-cyan-300 font-bold select-all flex items-center justify-between mt-1">
                  <span>{currentChain.pqcErc20Contract}</span>
                  <a
                    href={`${currentChain.blockExplorerUrls[0]}/address/${currentChain.pqcErc20Contract}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-cyan-400"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px]">ERC-721 POST-QUANTUM NFT CONTRACT</div>
                <div className="text-purple-300 font-bold select-all flex items-center justify-between mt-1">
                  <span>{currentChain.pqcNftErc721Contract}</span>
                  <a
                    href={`${currentChain.blockExplorerUrls[0]}/address/${currentChain.pqcNftErc721Contract}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-purple-400"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px]">CROSS-CHAIN QUANTUM BRIDGE CONTRACT</div>
                <div className="text-indigo-300 font-bold select-all flex items-center justify-between mt-1">
                  <span>{currentChain.bridgeContract}</span>
                  <a
                    href={`${currentChain.blockExplorerUrls[0]}/address/${currentChain.bridgeContract}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-indigo-400"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowContractModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold font-sans"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
