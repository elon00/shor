import React, { useState } from 'react';
import { SUPPORTED_CHAINS, getChainConfig } from '../lib/multichain';
import { Web3WalletState } from '../types';
import { audioSynth } from '../lib/audioSynth';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  ExternalLink,
  Coins,
  ShieldCheck,
  RefreshCw,
  Gift,
  Flame,
  ArrowUpRight,
  X,
} from 'lucide-react';

interface UniversalFaucetModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: Web3WalletState;
  setWallet: React.Dispatch<React.SetStateAction<Web3WalletState>>;
  onAddTerminalMessage?: (msg: string) => void;
}

export const UniversalFaucetModal: React.FC<UniversalFaucetModalProps> = ({
  isOpen,
  onClose,
  wallet,
  setWallet,
  onAddTerminalMessage,
}) => {
  const [claimingChainId, setClaimingChainId] = useState<number | null>(null);
  const [isClaimingAll, setIsClaimingAll] = useState(false);
  const [claimedChains, setClaimedChains] = useState<{ [key: number]: boolean }>({});

  if (!isOpen) return null;

  const testnetChains = SUPPORTED_CHAINS.filter((c) => c.category === 'Testnet');

  // 1-Click Single Chain Faucet Claim
  const handleClaimChainFaucet = (chainId: number) => {
    setClaimingChainId(chainId);
    audioSynth.playKeyExchange();

    setTimeout(() => {
      const chain = getChainConfig(chainId);
      setWallet((prev) => ({
        ...prev,
        pqcTokenBalance: prev.pqcTokenBalance + 50000,
        ethBalance: parseFloat((prev.ethBalance + 1.0).toFixed(3)),
        inrBalance: prev.inrBalance + 25000,
      }));

      setClaimedChains((prev) => ({ ...prev, [chainId]: true }));
      setClaimingChainId(null);
      audioSynth.playQuantumVerification();

      if (onAddTerminalMessage) {
        onAddTerminalMessage(
          `🎁 [FREE FAUCET CLAIMED] Claimed +50,000 $PQC & 1.0 ${chain.symbol} Gas for ${chain.name} (Chain ID: ${chain.id}) with ₹0 Gas fee!`
        );
      }
    }, 600);
  };

  // 1-Click Universal Claim for All Testnets
  const handleClaimAllFaucets = () => {
    setIsClaimingAll(true);
    audioSynth.playKeyExchange();

    setTimeout(() => {
      setWallet((prev) => ({
        ...prev,
        pqcTokenBalance: prev.pqcTokenBalance + 250000,
        ethBalance: parseFloat((prev.ethBalance + 5.0).toFixed(3)),
        inrBalance: prev.inrBalance + 100000,
      }));

      const allClaimed: { [key: number]: boolean } = {};
      testnetChains.forEach((c) => {
        allClaimed[c.id] = true;
      });
      setClaimedChains(allClaimed);
      setIsClaimingAll(false);
      audioSynth.playQuantumVerification();

      if (onAddTerminalMessage) {
        onAddTerminalMessage(
          `⚡ [UNIVERSAL FAUCET BATCH] Minted +250,000 $PQC & +5.0 Testnet Gas across all 6 EVM Testnets!`
        );
      }
    }, 900);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 max-w-2xl w-full shadow-2xl relative overflow-hidden text-slate-100">
        {/* Ambient Glow */}
        <div className="absolute -right-20 -top-20 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30">
              <Gift className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  Universal <span className="text-emerald-400">1-Click Free Faucets Hub</span>
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono">
                  100% Free • Zero Gas
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Claim free $PQC Quantum Energy tokens and official EVM testnet gas in a single click.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big 1-Click Claim All Banner */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/40 rounded-xl p-4 mb-5 relative z-10 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/40">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                Universal Batch Faucet Claim
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  +250,000 $PQC & +5.0 Gas
                </span>
              </div>
              <div className="text-xs text-slate-300">
                1-Click instant minting across all 6 testnets with ₹0 transaction fee.
              </div>
            </div>
          </div>

          <button
            onClick={handleClaimAllFaucets}
            disabled={isClaimingAll}
            className="px-4 py-2 rounded-xl text-xs font-bold font-sans flex items-center gap-2 transition bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black shadow-md shadow-emerald-500/20"
          >
            {isClaimingAll ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
                Claiming All Faucets...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-black text-black" />
                Claim All 6 Testnet Faucets
              </>
            )}
          </button>
        </div>

        {/* 6 Individual Testnet Faucet Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1 mb-5 relative z-10">
          {testnetChains.map((chain) => {
            const isClaimed = claimedChains[chain.id];
            const isClaiming = claimingChainId === chain.id;

            return (
              <div
                key={chain.id}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-3 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{chain.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-white leading-tight">{chain.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Chain ID: {chain.id} • {chain.symbol}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Instant In-App Mint */}
                  <button
                    onClick={() => handleClaimChainFaucet(chain.id)}
                    disabled={isClaiming}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-sans font-semibold flex items-center gap-1 transition ${
                      isClaimed
                        ? 'bg-emerald-950/60 border border-emerald-600/60 text-emerald-300'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm'
                    }`}
                  >
                    {isClaiming ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : isClaimed ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Claimed</span>
                      </>
                    ) : (
                      <>
                        <Gift className="w-3 h-3" />
                        <span>Claim Free</span>
                      </>
                    )}
                  </button>

                  {/* External Official Faucet Link */}
                  {chain.faucetUrl && (
                    <a
                      href={chain.faucetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition"
                      title="Open Official Web Faucet"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4 relative z-10">
          <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>FIPS 203 Post-Quantum Verified Testnet Faucets</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold font-sans transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
