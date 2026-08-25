import React, { useState } from 'react';
import { Web3WalletState } from '../types';
import { SUPPORTED_CHAINS, getChainConfig, switchEvmNetwork } from '../lib/multichain';
import { AutoMetaMaskBatchModal } from './AutoMetaMaskBatchModal';
import { UniversalFaucetModal } from './UniversalFaucetModal';
import {
  Wallet,
  Shield,
  Sparkles,
  Coins,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  ChevronDown,
  IndianRupee,
  ArrowLeftRight,
  Globe,
  Layers,
  Zap,
} from 'lucide-react';

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
  const [isMintingUnlimited, setIsMintingUnlimited] = useState(false);
  const [isBatchAutoModalOpen, setIsBatchAutoModalOpen] = useState(false);
  const [isFaucetModalOpen, setIsFaucetModalOpen] = useState(false);

  const currentChain = getChainConfig(wallet.chainId || 11155111);

  const handleNetworkSelect = async (chainId: number) => {
    setShowNetworkMenu(false);
    const targetChain = getChainConfig(chainId);

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
      onAddTerminalMessage(`🌐 [TESTNET/MULTICHAIN] Switched active network to ${targetChain.name} (Chain ID: ${targetChain.id}).`);
    }
  };

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        const chainIdHex = await (window as any).ethereum.request({ method: 'eth_chainId' });
        const chainIdInt = parseInt(chainIdHex, 16) || 11155111;
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
    const chainConfig = getChainConfig(wallet.chainId || 11155111);
    setWallet((prev) => ({
      ...prev,
      isConnected: true,
      address: `0x${randomHex.substring(0, 4)}...${randomHex.substring(36)}`,
      network: chainConfig.name,
      chainId: chainConfig.id,
      ethBalance: 5.842,
      nativeBalance: 5.842,
      pqcTokenBalance: 125000,
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

  const handleMintUnlimitedTokens = () => {
    setIsMintingUnlimited(true);
    setTimeout(() => {
      setWallet((prev) => ({
        ...prev,
        pqcTokenBalance: prev.pqcTokenBalance + 100000,
        inrBalance: prev.inrBalance + 50000,
        ethBalance: parseFloat((prev.ethBalance + 1.0).toFixed(3)),
      }));
      setIsMintingUnlimited(false);
      if (onAddTerminalMessage) {
        onAddTerminalMessage('⚡ [UNLIMITED MINT] Minted +100,000 $PQC & 1.0 Testnet ETH to wallet via Quantum Infinite Faucet!');
      }
    }, 600);
  };

  return (
    <div className="bg-slate-900/95 border-b border-slate-800 px-3 py-2 text-xs font-mono flex flex-wrap items-center justify-between gap-2.5 shadow-md backdrop-blur-md sticky top-0 z-40">
      {/* Left: Network Selector & 1-Click Auto Connect All Chains */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
          TESTNET & MULTICHAIN WEB 4.0
        </span>

        {/* 1-Click Auto-Connect All Chains to MetaMask Button */}
        <button
          onClick={() => setIsBatchAutoModalOpen(true)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-sans font-bold px-2.5 py-1 rounded-md text-[11px] transition shadow-md shadow-orange-500/20"
          title="Auto-connect and add all 9 multichains to MetaMask in 1-Click"
        >
          <Zap className="w-3.5 h-3.5 fill-black text-black animate-bounce" />
          <span>⚡ Auto-Connect All 9 Chains</span>
        </button>

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
            <div className="absolute left-0 mt-1.5 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 max-h-80 overflow-y-auto">
              <div className="text-[10px] text-slate-400 px-2 py-1 font-mono uppercase tracking-wider">
                Select EVM Testnet / Mainnet
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
                      <div className="font-semibold leading-tight">{chain.name}</div>
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
          <span>Bridge</span>
        </button>

        {/* Contract Info Modal Trigger */}
        <button
          onClick={() => setIsFaucetModalOpen(true)}
          className="text-slate-300 hover:text-cyan-400 text-[11px] flex items-center gap-1 transition bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800"
        >
          <Shield className="w-3 h-3 text-cyan-400" />
          <span>Faucets</span>
        </button>
      </div>

      {/* Right: Balances & Unlimited Minting Button */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {wallet.isConnected ? (
          <>
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
                <span className="text-[10px] text-purple-400 font-sans" title="Unlimited Supply Cap">
                  (∞)
                </span>
              </div>

              <div className="h-3 w-px bg-slate-800" />

              <div className="flex items-center gap-1 text-emerald-400 font-sans">
                <IndianRupee className="w-3 h-3" />
                <span className="font-bold">{wallet.inrBalance.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-emerald-300 font-mono">INR</span>
              </div>
            </div>

            <button
              onClick={handleMintUnlimitedTokens}
              disabled={isMintingUnlimited}
              className="px-2.5 py-1 rounded-md font-sans text-[11px] font-bold flex items-center gap-1 transition bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-sm"
              title="Mint +100,000 $PQC Infinite Tokens"
            >
              {isMintingUnlimited ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Minting...
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 text-cyan-200" />
                  +100k $PQC Faucet
                </>
              )}
            </button>

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
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="w-3.5 h-3.5" />
                Connect Wallet
              </>
            )}
          </button>
        )}
      </div>

      <UniversalFaucetModal
        isOpen={isFaucetModalOpen}
        onClose={() => setIsFaucetModalOpen(false)}
        wallet={wallet}
        setWallet={setWallet}
        onAddTerminalMessage={onAddTerminalMessage}
      />

      <AutoMetaMaskBatchModal
        isOpen={isBatchAutoModalOpen}
        onClose={() => setIsBatchAutoModalOpen(false)}
        wallet={wallet}
        setWallet={setWallet}
        onAddTerminalMessage={onAddTerminalMessage}
      />

      {showContractModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-lg w-full shadow-2xl text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2 text-cyan-400 font-bold font-sans">
                <Shield className="w-5 h-5 text-cyan-400" />
                Testnet & Multichain Contracts Architecture
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
                <div className="text-slate-400 text-[10px]">ACTIVE NETWORK</div>
                <div className="text-white font-bold flex items-center justify-between mt-1">
                  <div className="flex items-center gap-2">
                    <span>{currentChain.icon}</span>
                    <span>{currentChain.name} (Chain ID: {currentChain.id})</span>
                  </div>
                  {currentChain.faucetUrl && (
                    <a
                      href={currentChain.faucetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] flex items-center gap-1"
                    >
                      <span>Get Faucet ETH</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px]">UNLIMITED SUPPLY ERC-20 TOKEN ($PQC)</div>
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
                <div className="text-slate-400 text-[10px]">POST-QUANTUM ERC-721 NFT CONTRACT</div>
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
                <div className="text-slate-400 text-[10px]">QUANTUM CROSS-CHAIN BRIDGE CONTRACT</div>
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
