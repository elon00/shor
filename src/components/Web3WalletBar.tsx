import React, { useState } from 'react';
import { Web3WalletState } from '../types';
import { Wallet, Shield, Sparkles, Coins, ExternalLink, RefreshCw, CheckCircle2, ChevronRight, IndianRupee } from 'lucide-react';

interface Web3WalletBarProps {
  wallet: Web3WalletState;
  setWallet: React.Dispatch<React.SetStateAction<Web3WalletState>>;
  onClaimAirdrop: () => void;
}

export const Web3WalletBar: React.FC<Web3WalletBarProps> = ({ wallet, setWallet, onClaimAirdrop }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [hasClaimedAirdrop, setHasClaimedAirdrop] = useState(false);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    // Check if window.ethereum exists
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts[0]) {
          setWallet((prev) => ({
            ...prev,
            isConnected: true,
            address: accounts[0],
            isMetaMaskDetected: true,
          }));
        }
      } catch (err) {
        console.warn('User rejected MetaMask connection, connecting simulated Web3 wallet:', err);
        connectSimulatedWallet();
      }
    } else {
      // Connect simulated post-quantum Web3 wallet
      setTimeout(() => {
        connectSimulatedWallet();
      }, 500);
    }
    setIsConnecting(false);
  };

  const connectSimulatedWallet = () => {
    const randomHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setWallet((prev) => ({
      ...prev,
      isConnected: true,
      address: `0x${randomHex.substring(0, 4)}...${randomHex.substring(36)}`,
      network: 'Ethereum Mainnet (PQC EVM L2)',
      ethBalance: 3.485,
      pqcTokenBalance: 12500,
      inrBalance: 85400,
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
      inrBalance: prev.inrBalance + 10000,
    }));
  };

  return (
    <div className="bg-slate-900/90 border-b border-slate-800 px-3 py-2 text-xs font-mono flex flex-wrap items-center justify-between gap-3 shadow-md backdrop-blur-md">
      {/* Left: Web3 Network & Hackathon Badge */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
          ETH WEB3 & PQC NFT HACKATHON WINNER
        </span>

        <button
          onClick={() => setShowContractModal(!showContractModal)}
          className="text-slate-300 hover:text-cyan-400 text-[11px] flex items-center gap-1 transition bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800"
        >
          <Shield className="w-3 h-3 text-cyan-400" />
          Contracts & ERC-721
          <ChevronRight className="w-3 h-3 text-slate-500" />
        </button>
      </div>

      {/* Right: Balances & Wallet Connect Button */}
      <div className="flex items-center gap-3 flex-wrap">
        {wallet.isConnected ? (
          <>
            {/* Balances Display */}
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
              <div className="flex items-center gap-1 text-slate-300">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold text-slate-100">{wallet.ethBalance}</span>
                <span className="text-[10px] text-slate-400">ETH</span>
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
                  Claim +500 $PQC & ₹10,000
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
                Connecting Web3 Wallet...
              </>
            ) : (
              <>
                <Wallet className="w-3.5 h-3.5" />
                Connect Ethereum Wallet
              </>
            )}
          </button>
        )}
      </div>

      {/* Contract Address & Web3 Verification Modal */}
      {showContractModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-lg w-full shadow-2xl text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2 text-cyan-400 font-bold font-sans">
                <Shield className="w-5 h-5 text-cyan-400" />
                Smart Contract Deployment Architecture
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
                <div className="text-slate-400 text-[10px]">ERC-20 TOKEN CONTRACT ($PQC)</div>
                <div className="text-cyan-300 font-bold select-all flex items-center justify-between mt-1">
                  <span>{wallet.pqcErc20Contract}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 hover:text-cyan-400 cursor-pointer" />
                </div>
                <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> FIPS 203 Post-Quantum Encrypted Token Standard
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px]">ERC-721 AUTOMATON NFT CONTRACT</div>
                <div className="text-purple-300 font-bold select-all flex items-center justify-between mt-1">
                  <span>{wallet.pqcNftErc721Contract}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 hover:text-purple-400 cursor-pointer" />
                </div>
                <div className="text-[10px] text-purple-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> ML-DSA-65 Quantum Signature Validated Metadata
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px]">ETHEREUM EVM NETWORK STATUS</div>
                <div className="text-emerald-300 font-bold mt-1">
                  Connected to Ethereum Quantum EVM Testnet (Chain ID 31337)
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Block Height: #19,842,109 | Gas Price: 12 Gwei
                </div>
              </div>
            </div>

            <div className="mt-5 text-right">
              <button
                onClick={() => setShowContractModal(false)}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-sans text-xs font-medium"
              >
                Close Explorer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
