export type CellState = 'dead' | 'alive' | 'ai_agent' | 'quantum_locked' | 'evolving';

export type PqcAlgorithm = 'ML-KEM-768' | 'ML-DSA-65' | 'Falcon-512' | 'Kyber-1024';

export interface PqcKeypair {
  algorithm: PqcAlgorithm;
  publicKey: string;
  privateKeySnippet: string;
  securityLevelBits: number; // e.g. 192, 256
  latticeDimension: number;
}

export interface AiAgentData {
  id: string;
  persona: string;
  status: string;
  directive: string;
  memory: string[];
  autonomyLevel: number; // 1-10
  generation: number;
  energy: number; // 0-100
  lastDecisionTime?: string;
  decisionsCount: number;
}

export interface CellData {
  id: string;
  x: number;
  y: number;
  state: CellState;
  generation: number;
  energy: number;
  hash: string;
  pqcKey: PqcKeypair;
  aiAgent?: AiAgentData;
}

export interface PqcProof {
  id: string;
  senderCellId: string;
  algorithm: PqcAlgorithm;
  signature: string;
  cipherText: string;
  hash: string;
  verified: boolean;
  timestamp: string;
  latencyMs: number;
}

export interface GridConfig {
  width: number;
  height: number;
  speedMs: number;
  mutationRate: number; // 0.0 - 0.1
  aiFrequency: number;  // every N steps
  pqcStrictness: 'Standard' | 'Strict' | 'Quantum-Max';
  enableAudio: boolean;
}

export interface AgentLog {
  id: string;
  timestamp: string;
  cellPos?: [number, number];
  category: 'AI' | 'PQC' | 'EVOLUTION' | 'CONSENSUS' | 'SECURITY';
  title: string;
  detail: string;
}

export interface QuantumAttackState {
  status: 'idle' | 'attacking' | 'thwarted';
  qubits: number;
  rsaStatus: 'COMPROMISED (0.002s)';
  pqcStatus: 'SECURE (Lattice Dimension 768 Resisted)';
  attackedVectorsCount: number;
  blockedCount: number;
  lastAttackTimestamp?: string;
}

// Multichain Web3 & EVM State
export interface Web3WalletState {
  isConnected: boolean;
  address: string;
  network: string;
  chainId: number;
  nativeBalance: number;
  ethBalance: number;
  pqcTokenBalance: number;
  inrBalance: number;
  pqcErc20Contract: string;
  pqcNftErc721Contract: string;
  bridgeContract: string;
  isMetaMaskDetected: boolean;
}

// Cross-Chain Bridge Transfer State
export interface CrossChainBridgeState {
  isOpen: boolean;
  sourceChainId: number;
  targetChainId: number;
  tokenType: 'PQC' | 'NFT';
  amount: number;
  targetAddress: string;
  status: 'IDLE' | 'LOCKING' | 'GENERATING_PROOF' | 'RELAYING' | 'COMPLETED' | 'FAILED';
  txHash?: string;
  bridgeFeePqc: number;
}

// PQC NFT Metadata & Listing Interface
export interface PqcNftItem {
  id: string;
  tokenId: number;
  chainId: number;
  name: string;
  description: string;
  image: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Quantum-Mythic';
  priceEth: number;
  pricePqc: number;
  ownerAddress: string;
  creatorAddress: string;
  latticeHash: string;
  pqcSignature: string;
  attributes: {
    generation: number;
    powerLevel: number;
    quantumResilience: string;
    algorithm: PqcAlgorithm;
  };
  isForSale: boolean;
  mintTimestamp: string;
}

// INR Exchange & Payment Transaction Interface
export interface InrTransaction {
  id: string;
  chainId: number;
  type: 'BUY_CRYPTO' | 'SELL_CRYPTO' | 'DEPOSIT_INR' | 'WITHDRAW_INR';
  paymentMethod: 'UPI_GPAY' | 'UPI_PHONEPE' | 'UPI_PAYTM' | 'NETBANKING' | 'DEBIT_CARD';
  cryptoAmount: number;
  cryptoSymbol: 'ETH' | '$PQC' | 'POL' | 'BNB' | 'AVAX';
  inrAmount: number;
  exchangeRate: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  utrNumber: string;
  txHash: string;
  timestamp: string;
}

// WWE Metaverse AI Fighter Interface
export interface WweFighter {
  id: string;
  name: string;
  ringTitle: string;
  avatarUrl: string;
  health: number;
  maxHealth: number;
  energy: number;
  attackPower: number;
  defensePower: number;
  specialMove: {
    name: string;
    damage: number;
    pqcType: PqcAlgorithm;
    description: string;
  };
  isAiAgent: boolean;
  wins: number;
  losses: number;
  nftTokenId?: number;
}

// WWE Metaverse Fight Match State
export interface WweMatchState {
  id: string;
  fighter1: WweFighter;
  fighter2: WweFighter;
  currentTurn: 1 | 2;
  status: 'IDLE' | 'FIGHTING' | 'FINISHED';
  wagerAmountPqc: number;
  winnerId?: string;
  round: number;
  battleLog: {
    round: number;
    attacker: string;
    action: string;
    damage: number;
    commentary: string;
    timestamp: string;
  }[];
  ringVenue: 'Quantum Mania Ring' | 'Lattice Royal Rumble' | 'Metaverse Smackdown Arena';
}

// Shor Global Synchronization & Multichain State Integration
export interface ShorSyncState {
  isAutoSyncEnabled: boolean;
  status: 'SYNCED' | 'SYNCHRONIZING' | 'OFFLINE';
  lastSyncTime: string;
  blockHeight: number;
  activePeers: number;
  syncedChainsCount: number;
  latticeEntropy: number;
  pqcVerificationRate: number;
  pendingSyncTasks: number;
  syncHistory: {
    id: string;
    type: 'CROSS_CHAIN' | 'LATTICE_PROOF' | 'AUTOMATON_STATE' | 'ORDERBOOK' | 'AGENT_SWARM';
    message: string;
    timestamp: string;
    status: 'CONFIRMED' | 'RELAYED';
  }[];
}
