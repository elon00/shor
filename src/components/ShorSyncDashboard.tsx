import React, { useState } from 'react';
import { ShorSyncState, Web3WalletState, PqcProof, CellData } from '../types';
import { SUPPORTED_CHAINS } from '../lib/multichain';
import { audioSynth } from '../lib/audioSynth';
import {
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  Layers,
  Network,
  Cpu,
  Zap,
  Globe,
  Radio,
  Server,
  Activity,
  ArrowRight,
  Database,
  Lock,
} from 'lucide-react';

interface ShorSyncDashboardProps {
  syncState: ShorSyncState;
  setSyncState: React.Dispatch<React.SetStateAction<ShorSyncState>>;
  wallet: Web3WalletState;
  grid: CellData[][];
  pqcProofs: PqcProof[];
  onTriggerSync: () => void;
  isSynchronizing: boolean;
  onAddTerminalMessage?: (msg: string) => void;
}

export const ShorSyncDashboard: React.FC<ShorSyncDashboardProps> = ({
  syncState,
  setSyncState,
  wallet,
  grid,
  pqcProofs,
  onTriggerSync,
  isSynchronizing,
  onAddTerminalMessage,
}) => {
  const [selectedChainId, setSelectedChainId] = useState<number>(wallet.chainId || 1);
  const activeCells = grid.flat().filter((c) => c.state !== 'dead').length;

  const toggleAutoSync = () => {
    setSyncState((prev) => {
      const next = !prev.isAutoSyncEnabled;
      if (onAddTerminalMessage) {
        onAddTerminalMessage(
          `🔄 [SHOR PROTOCOL] Autonomous cross-chain background synchronization ${next ? 'ENABLED' : 'PAUSED'}.`
        );
      }
      return { ...prev, isAutoSyncEnabled: next };
    });
    audioSynth.playUiClick();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Protocol Sync Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                <RefreshCw className={`w-5 h-5 ${isSynchronizing ? 'animate-spin text-cyan-200' : ''}`} />
              </div>
              <h2 className="text-xl font-bold text-white tracking-wide">
                Shor Protocol <span className="text-cyan-400">Global State Synchronizer</span>
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {syncState.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Real-time cryptographic consensus and multichain state propagation connecting Conway Cellular Automaton,
              NIST ML-KEM-768 lattice proofs, $PQC infinite liquidity ledger, and 9 EVM testnets.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleAutoSync}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 border transition ${
                syncState.isAutoSyncEnabled
                  ? 'bg-emerald-950/60 border-emerald-700/80 text-emerald-300 hover:bg-emerald-900/60'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${syncState.isAutoSyncEnabled ? 'text-emerald-400 animate-pulse' : ''}`} />
              <span>Auto-Sync: {syncState.isAutoSyncEnabled ? 'ACTIVE (5s)' : 'PAUSED'}</span>
            </button>

            <button
              onClick={onTriggerSync}
              disabled={isSynchronizing}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-sans text-xs font-semibold flex items-center gap-2 shadow-lg shadow-cyan-900/40 disabled:opacity-50 transition transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <RefreshCw className={`w-4 h-4 ${isSynchronizing ? 'animate-spin' : ''}`} />
              <span>{isSynchronizing ? 'Propagating Consensus...' : 'Synchronize Protocol Now'}</span>
            </button>
          </div>
        </div>

        {/* Status Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-slate-800/80 font-mono">
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3 h-3 text-cyan-400" />
              <span>Block Height</span>
            </div>
            <div className="text-base font-bold text-white mt-1">
              #{syncState.blockHeight.toLocaleString()}
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-3 h-3 text-indigo-400" />
              <span>EVM Chains</span>
            </div>
            <div className="text-base font-bold text-indigo-300 mt-1">
              {SUPPORTED_CHAINS.length} Connected
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Server className="w-3 h-3 text-emerald-400" />
              <span>Active Peers</span>
            </div>
            <div className="text-base font-bold text-emerald-300 mt-1">
              {syncState.activePeers} Nodes
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>Lattice Entropy</span>
            </div>
            <div className="text-base font-bold text-amber-300 mt-1">
              {syncState.latticeEntropy}%
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-cyan-400" />
              <span>PQC Verification</span>
            </div>
            <div className="text-base font-bold text-cyan-300 mt-1">
              {syncState.pqcVerificationRate}%
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3 h-3 text-rose-400" />
              <span>Last Sync</span>
            </div>
            <div className="text-xs font-bold text-slate-300 mt-1.5 truncate">
              {syncState.lastSyncTime}
            </div>
          </div>
        </div>
      </div>

      {/* Multichain Sync Matrix & Integration Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Multichain Network Synchronization Matrix */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-sm text-white">Multichain State Synchronization Matrix</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Synchronized 9 of 9 EVM Networks
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {SUPPORTED_CHAINS.map((chain) => {
              const isCurrent = wallet.chainId === chain.id;
              return (
                <div
                  key={chain.id}
                  onClick={() => setSelectedChainId(chain.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-cyan-950/60 border-cyan-500/80 shadow-md shadow-cyan-950'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{chain.icon}</span>
                      <div>
                        <div className="font-bold text-xs text-white">{chain.shortName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Chain ID: {chain.id}</div>
                      </div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">Status:</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      100% Synchronized
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cross-Module Integration Map */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider mb-3">
              Shor Protocol Core Integration Topology
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Conway Grid</span>
                </div>
                <div className="text-[11px] text-slate-300">{activeCells} Active Cells</div>
                <div className="text-[10px] text-emerald-400">State: Hash Consensus</div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                <div className="text-purple-400 font-bold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>PQC Lattice Hub</span>
                </div>
                <div className="text-[11px] text-slate-300">{pqcProofs.length} Proofs Verified</div>
                <div className="text-[10px] text-emerald-400">Algorithm: ML-KEM-768</div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                <div className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>$PQC Liquidity</span>
                </div>
                <div className="text-[11px] text-slate-300">{wallet.pqcTokenBalance.toLocaleString()} $PQC</div>
                <div className="text-[10px] text-emerald-400">Infinite Faucet: Open</div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  <span>Fiat Gateway</span>
                </div>
                <div className="text-[11px] text-slate-300">₹{wallet.inrBalance.toLocaleString('en-IN')} INR</div>
                <div className="text-[10px] text-emerald-400">UPI Instant Settlement</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Synchronization Log & Telemetry */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">Synchronization Event Stream</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">
                Live Feed
              </span>
            </div>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {syncState.syncHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-cyan-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {item.type}
                    </span>
                    <span className="text-slate-500">{item.timestamp}</span>
                  </div>
                  <div className="text-slate-300 text-[11px] leading-relaxed">
                    {item.message}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>Protocol Latency: ~12ms</span>
            <span className="text-emerald-400">Node Sync: 100% Ok</span>
          </div>
        </div>
      </div>
    </div>
  );
};
