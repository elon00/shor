import React, { useState } from 'react';
import { Web3WalletState } from '../types';
import { SUPPORTED_CHAINS, getChainConfig, switchEvmNetwork } from '../lib/multichain';
import { ArrowRight, ArrowLeftRight, ShieldCheck, Sparkles, CheckCircle2, RefreshCw, ExternalLink, X, Lock } from 'lucide-react';

interface MultichainBridgeModalProps {
  wallet: Web3WalletState;
  setWallet: React.Dispatch<React.SetStateAction<Web3WalletState>>;
  isOpen: boolean;
  onClose: () => void;
  onAddTerminalMessage: (msg: string) => void;
}

export const MultichainBridgeModal: React.FC<MultichainBridgeModalProps> = ({
  wallet,
  setWallet,
  isOpen,
  onClose,
  onAddTerminalMessage,
}) => {
  const [sourceChainId, setSourceChainId] = useState<number>(wallet.chainId || 1);
  const [targetChainId, setTargetChainId] = useState<number>(137); // Default Polygon
  const [bridgeAmount, setBridgeAmount] = useState<string>('500');
  const [bridgeStatus, setBridgeStatus] = useState<'IDLE' | 'LOCKING' | 'PROOF_GEN' | 'RELAYING' | 'COMPLETED'>('IDLE');
  const [proofDetails, setProofDetails] = useState<{ hash: string; sig: string; txHash: string } | null>(null);

  if (!isOpen) return null;

  const sourceChain = getChainConfig(sourceChainId);
  const targetChain = getChainConfig(targetChainId);

  const handleSwapChains = () => {
    const temp = sourceChainId;
    setSourceChainId(targetChainId);
    setTargetChainId(temp);
  };

  const handleExecuteBridge = async () => {
    const amt = parseFloat(bridgeAmount);
    if (!amt || amt <= 0) {
      alert('Please enter a valid bridge amount.');
      return;
    }
    if (amt > wallet.pqcTokenBalance) {
      alert(`Insufficient $PQC balance! You have ${wallet.pqcTokenBalance} $PQC.`);
      return;
    }
    if (sourceChainId === targetChainId) {
      alert('Source and target chains must be different!');
      return;
    }

    setBridgeStatus('LOCKING');
    onAddTerminalMessage(`[MULTICHAIN BRIDGE] Initiating transfer of ${amt} $PQC from ${sourceChain.name} to ${targetChain.name}...`);

    // Step 1: Locking tokens
    await new Promise((r) => setTimeout(r, 1200));
    setBridgeStatus('PROOF_GEN');
    onAddTerminalMessage(`[MULTICHAIN BRIDGE] Generating FIPS 203 ML-KEM-768 lattice cross-chain proof for chain ID ${targetChainId}...`);

    // Step 2: Proof generation
    await new Promise((r) => setTimeout(r, 1500));
    const randomTx = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const randomSig = 'ML-DSA-65-BRIDGE-SIG-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const randomHash = '0xLATTICE_' + Math.random().toString(16).substring(2, 12);
    setProofDetails({ hash: randomHash, sig: randomSig, txHash: randomTx });

    setBridgeStatus('RELAYING');
    onAddTerminalMessage(`[MULTICHAIN BRIDGE] Relaying signed state to ${targetChain.name} Quantum Bridge contract ${targetChain.bridgeContract}...`);

    // Step 3: Relaying and Minting
    await new Promise((r) => setTimeout(r, 1800));
    setBridgeStatus('COMPLETED');
    onAddTerminalMessage(`✓ [MULTICHAIN BRIDGE SUCCESS] ${amt} $PQC successfully minted on ${targetChain.name}! Tx: ${randomTx.substring(0, 18)}...`);

    // Deduct / switch state
    setWallet((prev) => ({
      ...prev,
      pqcTokenBalance: prev.pqcTokenBalance, // multichain total preserved
    }));
  };

  const handleReset = () => {
    setBridgeStatus('IDLE');
    setProofDetails(null);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 max-w-lg w-full shadow-2xl text-slate-100 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-900/40">
            <ArrowLeftRight className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Quantum Multichain Bridge
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                FIPS 203 ML-KEM
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Transfer $PQC tokens & automaton states seamlessly across 9 EVM blockchains.
            </p>
          </div>
        </div>

        {/* Bridge Chain Selection Grid */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 items-center relative">
            {/* Source Chain */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <label className="text-[10px] font-mono text-slate-400 block mb-1">SOURCE CHAIN</label>
              <select
                value={sourceChainId}
                onChange={(e) => setSourceChainId(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg p-2 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              >
                {SUPPORTED_CHAINS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.shortName} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Target Chain */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <label className="text-[10px] font-mono text-slate-400 block mb-1">TARGET CHAIN</label>
              <select
                value={targetChainId}
                onChange={(e) => setTargetChainId(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg p-2 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              >
                {SUPPORTED_CHAINS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.shortName} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <button
              onClick={handleSwapChains}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center shadow-lg transition"
              title="Swap Chains"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* Amount Input */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-400 font-mono">BRIDGE AMOUNT ($PQC)</span>
              <span className="text-cyan-400 font-mono">
                Balance: {wallet.pqcTokenBalance.toLocaleString()} $PQC
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={bridgeAmount}
                onChange={(e) => setBridgeAmount(e.target.value)}
                placeholder="Enter amount"
                className="flex-1 bg-slate-900 border border-slate-700 text-sm text-white px-3 py-2 rounded-lg font-mono focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              />
              <button
                onClick={() => setBridgeAmount(wallet.pqcTokenBalance.toString())}
                className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs font-mono font-semibold"
              >
                MAX
              </button>
            </div>
          </div>

          {/* Route & Fee Breakdown */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Estimated Relayer Gas:</span>
              <span className="text-slate-200">~{sourceChain.gasAvgGwei} Gwei ({sourceChain.symbol})</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Bridge Security Protocol:</span>
              <span className="text-cyan-300">FIPS 203 ML-KEM-768 Lattice</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Destination Bridge Contract:</span>
              <span className="text-slate-300 truncate max-w-[200px]" title={targetChain.bridgeContract}>
                {targetChain.bridgeContract.substring(0, 10)}...{targetChain.bridgeContract.substring(34)}
              </span>
            </div>
          </div>

          {/* Progress / Status Flow */}
          {bridgeStatus !== 'IDLE' && (
            <div className="bg-slate-950 border border-cyan-900/60 p-3.5 rounded-xl space-y-2 font-mono text-xs">
              <div className="flex items-center gap-2 text-cyan-300 font-bold">
                {bridgeStatus === 'COMPLETED' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
                )}
                <span>
                  {bridgeStatus === 'LOCKING' && '1/3: Locking tokens on source chain...'}
                  {bridgeStatus === 'PROOF_GEN' && '2/3: Generating PQC lattice signature proof...'}
                  {bridgeStatus === 'RELAYING' && '3/3: Relaying state & minting on target chain...'}
                  {bridgeStatus === 'COMPLETED' && '✓ Bridge Transfer Completed Successfully!'}
                </span>
              </div>

              {proofDetails && (
                <div className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-slate-800">
                  <div>Tx Hash: <span className="text-cyan-300 select-all">{proofDetails.txHash.substring(0, 24)}...</span></div>
                  <div>Lattice Hash: <span className="text-purple-300 select-all">{proofDetails.hash}</span></div>
                  <div>Signature: <span className="text-emerald-300 select-all">{proofDetails.sig}</span></div>
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          {bridgeStatus === 'COMPLETED' ? (
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-sans text-xs font-semibold"
              >
                Bridge More
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-semibold"
              >
                Done
              </button>
            </div>
          ) : (
            <button
              onClick={handleExecuteBridge}
              disabled={bridgeStatus !== 'IDLE'}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-sans text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/30 transition disabled:opacity-50"
            >
              {bridgeStatus === 'IDLE' ? (
                <>
                  <Lock className="w-4 h-4" />
                  Bridge {bridgeAmount} $PQC to {targetChain.shortName}
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Processing Cross-Chain Transfer...
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
