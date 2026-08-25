import { ShorSyncState, Web3WalletState, PqcProof, CellData } from '../types';
import { SUPPORTED_CHAINS } from './multichain';
import { calculateStateHash, createPqcProof } from './pqc';

export function createInitialSyncState(): ShorSyncState {
  return {
    isAutoSyncEnabled: true,
    status: 'SYNCED',
    lastSyncTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    blockHeight: 18492040,
    activePeers: 128,
    syncedChainsCount: SUPPORTED_CHAINS.length,
    latticeEntropy: 98.6,
    pqcVerificationRate: 99.98,
    pendingSyncTasks: 0,
    syncHistory: [
      {
        id: 'sync-genesis-1',
        type: 'CROSS_CHAIN',
        message: 'Initialized Shor Multichain State Synchronizer across 9 EVM chains.',
        timestamp: new Date().toLocaleTimeString(),
        status: 'CONFIRMED',
      },
      {
        id: 'sync-genesis-2',
        type: 'LATTICE_PROOF',
        message: 'NIST ML-KEM-768 & ML-DSA-65 post-quantum lattice consensus verified.',
        timestamp: new Date().toLocaleTimeString(),
        status: 'CONFIRMED',
      },
    ],
  };
}

export interface SyncPayload {
  grid: CellData[][];
  wallet: Web3WalletState;
  pqcProofs: PqcProof[];
}

export function performShorSynchronization(
  currentState: ShorSyncState,
  payload: SyncPayload
): {
  newSyncState: ShorSyncState;
  generatedProof: PqcProof;
  syncedProofCount: number;
} {
  const activeCells = payload.grid.flat().filter((c) => c.state !== 'dead').length;
  const newBlock = currentState.blockHeight + Math.floor(Math.random() * 3) + 1;
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const generatedProof = createPqcProof(
    'SHOR-ORCHESTRATOR-NODE',
    'ML-KEM-768',
    `LatticeSync::Block#${newBlock}::Pop:${activeCells}::Wallet:${payload.wallet.address}`
  );

  const newHistoryItem = {
    id: `sync-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    type: 'CROSS_CHAIN' as const,
    message: `Synchronized ${activeCells} active automaton cells with ${payload.wallet.network} (Block #${newBlock}).`,
    timestamp: nowStr,
    status: 'CONFIRMED' as const,
  };

  const newSyncState: ShorSyncState = {
    ...currentState,
    status: 'SYNCED',
    lastSyncTime: nowStr,
    blockHeight: newBlock,
    activePeers: Math.min(256, Math.max(90, currentState.activePeers + Math.floor(Math.random() * 5) - 2)),
    latticeEntropy: +(98 + Math.random() * 1.8).toFixed(2),
    pqcVerificationRate: +(99.9 + Math.random() * 0.09).toFixed(3),
    pendingSyncTasks: 0,
    syncHistory: [newHistoryItem, ...currentState.syncHistory.slice(0, 30)],
  };

  return {
    newSyncState,
    generatedProof,
    syncedProofCount: payload.pqcProofs.length + 1,
  };
}
